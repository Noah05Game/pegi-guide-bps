import { runPipeline } from './flowRun.js'

const KEY = import.meta.env.VITE_POLLINATIONS_KEY || ''
const JUDGE_MODEL = import.meta.env.VITE_POLLINATIONS_MODEL || 'openai'
const SEARCH_MODEL = import.meta.env.VITE_POLLINATIONS_SEARCH_MODEL || 'gemini-search'
const URL_ = import.meta.env.VITE_POLLINATIONS_URL || 'https://gen.pollinations.ai/v1/chat/completions'

// Tried in order for each title until one finds an official rating.
const SEARCH_MODELS = [...new Set([SEARCH_MODEL, 'gemini-search', 'perplexity-fast', 'perplexity-reasoning'])]

export const hasKey = () => KEY.startsWith('sk_') || KEY.startsWith('pk_')

async function chat(model, messages, signal) {
  const res = await fetch(URL_, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${KEY}` },
    body: JSON.stringify({ model, messages, stream: false }),
    signal,
  })
  if (res.status === 401 || res.status === 403) throw new Error('BAD_KEY')
  if (res.status === 402) throw new Error('NO_CREDIT')
  if (res.status === 429) throw new Error('RATE')
  if (!res.ok) throw new Error('HTTP_' + res.status)
  const body = await res.json()
  return body?.choices?.[0]?.message?.content
}

export async function runFlow(age, text, onStage = () => {}) {
  if (!hasKey()) throw new Error('NO_KEY')
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), 240000)
  try {
    return await runPipeline({
      age, text, chat, onStage,
      searchModels: SEARCH_MODELS,
      judgeModel: JUDGE_MODEL,
      signal: ctrl.signal,
    })
  } catch (e) {
    if (e.name === 'AbortError') throw new Error('TIMEOUT')
    if (e instanceof SyntaxError || e.message === 'No JSON found' || e.message === 'Empty reply') throw new Error('PARSE')
    throw e
  } finally {
    clearTimeout(timer)
  }
}

export function friendlyError(code) {
  const map = {
    NO_KEY: 'Flow needs an API key. Add it to the .env file, then restart the dev server (see README).',
    BAD_KEY: 'Flow could not sign in. The API key in .env looks wrong or expired.',
    NO_CREDIT: 'Flow has run out of Pollen credit. Top up at enter.pollinations.ai.',
    RATE: 'Flow is busy right now. Wait a few seconds and try again.',
    TIMEOUT: 'Flow took too long. Try a shorter list or run it again.',
    PARSE: 'Flow sent back something we could not read. Run it again.',
  }
  return map[code] || 'Something went wrong while running Flow. Check your connection and try again.'
}
