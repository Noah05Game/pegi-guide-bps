import {
  SYSTEM_PROMPT, RESEARCH_PROMPT, MAX_ITEMS, BASIS_RANK, buildResearchMessage, buildJudgeMessage,
  extractJSON, cleanFindings, normalise,
} from './flowLogic.js'

const FATAL = ['BAD_KEY', 'NO_CREDIT', 'RATE']

export function splitTitles(text) {
  const seen = new Set()
  return String(text)
    .split(/[\n,;]+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 1 && !seen.has(t.toLowerCase()) && seen.add(t.toLowerCase()))
    .slice(0, MAX_ITEMS)
}

// Research ONE title. Walk down the list of search models until one finds an
// official rating; keep the best answer seen so far.
export async function researchTitle(title, { chat, models, today, signal }) {
  const messages = [
    { role: 'system', content: RESEARCH_PROMPT(today) },
    { role: 'user', content: buildResearchMessage(title) },
  ]
  const attempts = []
  let best = null
  for (const model of models) {
    try {
      const content = await chat(model, messages, signal)
      const f = cleanFindings(extractJSON(content))[0]
      if (!f) throw new Error('no finding')
      f.typed = title
      attempts.push({ model, basis: f.basis, rating: f.rating, source: f.source })
      if (!best || BASIS_RANK[f.basis] > BASIS_RANK[best.basis]) best = f
      if (best.basis === 'official') break
    } catch (e) {
      if (FATAL.includes(e.message) || e.name === 'AbortError') throw e
      attempts.push({ model, error: e.message })
    }
  }
  if (!best) {
    best = { typed: title, name: title, type: 'other', rating: 'Unknown', ratingAge: null, basis: 'none', source: '', status: 'unknown', notes: '' }
  }
  return { finding: best, attempts }
}

async function pool(items, size, worker) {
  const out = new Array(items.length)
  let next = 0
  await Promise.all(
    Array.from({ length: Math.min(size, items.length) }, async () => {
      while (next < items.length) {
        const i = next++
        out[i] = await worker(items[i], i)
      }
    })
  )
  return out
}

export async function runPipeline({ age, text, chat, searchModels, judgeModel, signal, onStage = () => {} }) {
  const titles = splitTitles(text)
  const today = new Date().toISOString().slice(0, 10)

  onStage('research')
  const results = await pool(titles, 5, (t) => researchTitle(t, { chat, models: searchModels, today, signal }))
  const findings = results.map((r) => r.finding)
  const diagnostics = results.map((r) => ({ title: r.finding.name || r.finding.typed, attempts: r.attempts }))

  onStage('judge')
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: buildJudgeMessage(age, text, findings) },
  ]
  let content
  try {
    content = await chat(judgeModel, messages, signal)
  } catch (e) {
    if (FATAL.includes(e.message) || judgeModel === 'openai') throw e
    content = await chat('openai', messages, signal)
  }
  return normalise(extractJSON(content), age, findings, diagnostics)
}
