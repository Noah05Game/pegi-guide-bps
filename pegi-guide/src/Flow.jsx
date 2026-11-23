import { useEffect, useRef, useState } from 'react'
import { runFlow, friendlyError, hasKey } from './flow.js'

const STAGES = [
  'Reading your list',
  'Searching the web for official ratings',
  'Checking PEGI and store pages',
  'Checking each one against your age',
  'Weighing up the risks',
  'Writing your feedback',
]
const RESEARCH_END = 3 // stages 0-2 belong to research; the judge starts at 3
const TITLES = { green: 'Looking good', amber: 'Okay with care', red: 'Not suitable yet' }
const CHIP = { green: 'OK', amber: 'With care', red: 'Too young', unknown: 'Check it' }

export default function Flow() {
  const [age, setAge] = useState('')
  const [text, setText] = useState('')
  const [phase, setPhase] = useState('idle') // idle | running | done | error
  const [stage, setStage] = useState(0)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [ranAge, setRanAge] = useState(null)
  const timer = useRef(null)
  const phaseCap = useRef(RESEARCH_END - 1)

  useEffect(() => () => clearInterval(timer.current), [])

  const n = parseInt(age, 10)
  const ageOk = Number.isFinite(n) && n >= 1 && n <= 120
  const canRun = ageOk && text.trim().length > 1 && phase !== 'running'

  async function start() {
    if (!canRun) return
    setPhase('running')
    setStage(0)
    setResult(null)
    setError('')
    setRanAge(n)
    timer.current = setInterval(() => setStage((s) => Math.min(s + 1, phaseCap.current)), 3500)
    phaseCap.current = RESEARCH_END - 1
    try {
      const r = await runFlow(n, text, (step) => {
        if (step === 'judge') {
          phaseCap.current = STAGES.length - 1
          setStage((s) => Math.max(s, RESEARCH_END))
        }
      })
      setResult(r)
      setPhase('done')
    } catch (e) {
      setError(friendlyError(e.message))
      setPhase('error')
    } finally {
      clearInterval(timer.current)
    }
  }

  function reset() {
    setPhase('idle')
    setResult(null)
    setError('')
  }

  const tone = phase === 'done' && result ? result.overall : null

  return (
    <section className="flow" aria-labelledby="flow-title">
      <div className="flow-brand">
        <h2 id="flow-title">Flow</h2>
        <span>powered by 05 AI</span>
      </div>
      <p className="flow-intro">
        Type in your age and every game and app you use. Flow checks each one and tells you if the mix is right for you.
      </p>

      <div className="panel flow-form">
        <label className="field">
          <span>How old are you?</span>
          <input type="number" inputMode="numeric" min="1" max="120" placeholder="Enter age" value={age} onChange={(e) => setAge(e.target.value)} disabled={phase === 'running'} />
        </label>
        <label className="field">
          <span>Games and apps you use</span>
          <textarea
            rows="5"
            placeholder={'Minecraft\nFortnite\nTikTok\nYouTube'}
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={phase === 'running'}
            maxLength={1500}
          />
        </label>
        <p className="flow-privacy">Put one per line or separate them with commas. Don’t type your name or any personal details.</p>
        <div className="flow-actions">
          <button className="run-btn" onClick={start} disabled={!canRun}>
            {phase === 'running' ? 'Running Flow…' : phase === 'done' || phase === 'error' ? 'Run Flow again' : 'Run Flow'}
          </button>
          {(phase === 'done' || phase === 'error') && (
            <button className="ghost-btn" onClick={reset}>Clear result</button>
          )}
        </div>
        {!hasKey() && (
          <p className="flow-warn">No API key found. Add one to the .env file and restart the app (see README).</p>
        )}
      </div>

      <div className={`flow-hero ${phase} ${tone ? `tone-${tone}` : ''}`} aria-live="polite">
        <div className="layer layer-blue" aria-hidden="true">
          <i className="blob b1" /><i className="blob b2" /><i className="blob b3" />
        </div>
        <div className="layer layer-tone" aria-hidden="true" />
        <div className="hero-content">
          {phase === 'idle' && (
            <>
              <strong>Flow is ready</strong>
              <p>Add your age and your list, then press Run Flow.</p>
            </>
          )}
          {phase === 'running' && (
            <>
              <strong>{STAGES[stage]}…</strong>
              <p>Flow is researching each title, so this can take 20 to 40 seconds.</p>
            </>
          )}
          {phase === 'error' && (
            <>
              <strong>Flow hit a problem</strong>
              <p>{error}</p>
            </>
          )}
          {phase === 'done' && result && (
            <>
              <span className="hero-label">{TITLES[result.overall]}</span>
              <strong>{result.headline || TITLES[result.overall]}</strong>
              <p>{result.summary}</p>
            </>
          )}
        </div>
      </div>

      {phase === 'done' && result && (
        <div className="flow-results">
          {result.items.length > 0 && (
            <div className="res-block">
              <h3>Checked for age {ranAge}</h3>
              <ul className="item-list">
                {result.items.map((it) => (
                  <li key={it.name} className={`item ${it.status}`}>
                    <div className="item-top">
                      <strong>{it.name}</strong>
                      <span className="item-rating">{it.rating}</span>
                      {it.basis === 'equivalent' && <span className="basis">Converted from another rating board</span>}
                      {it.basis === 'expected' && <span className="basis">Expected rating, not confirmed</span>}
                      <span className={`chip-status ${it.status}`}>{CHIP[it.status]}</span>
                    </div>
                    {it.why && <p>{it.why}</p>}
                    {it.source && it.basis !== 'none' && <p className="source">Source: {it.source}</p>}
                    {it.concerns.length > 0 && (
                      <ul className="concerns">{it.concerns.map((c) => <li key={c}>{c}</li>)}</ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.dangers.length > 0 && (
            <div className="res-block danger">
              <h3>{result.overall === 'red' ? 'Dangers to know about' : 'Things to watch'}</h3>
              <ul>{result.dangers.map((d) => <li key={d}>{d}</li>)}</ul>
            </div>
          )}

          {result.positives.length > 0 && (
            <div className="res-block good">
              <h3>What’s good</h3>
              <ul>{result.positives.map((d) => <li key={d}>{d}</li>)}</ul>
            </div>
          )}

          {result.tips.length > 0 && (
            <div className="res-block">
              <h3>What to do next</h3>
              <ul>{result.tips.map((d) => <li key={d}>{d}</li>)}</ul>
            </div>
          )}

          {result.diagnostics?.length > 0 && (
            <details className="how">
              <summary>How Flow checked this</summary>
              <ul>
                {result.diagnostics.map((d) => (
                  <li key={d.title}>
                    <strong>{d.title}</strong>
                    <ul>
                      {d.attempts.map((a, i) => (
                        <li key={i}>
                          {a.model}: {a.error ? `failed (${a.error})` : `${a.basis}${a.rating && a.rating !== 'Unknown' ? `, ${a.rating}` : ''}${a.source ? `, ${a.source}` : ''}`}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </details>
          )}

          <p className="flow-note">
            {!result.researched && 'Live web research was not available this time, so these ratings come from Flow’s own knowledge and may be out of date. '}
            {result.confidenceNote && `${result.confidenceNote} `}
            Flow (05 AI) can make mistakes. Check ratings at pegi.info and talk it through with a parent, carer or teacher.
          </p>
        </div>
      )}
    </section>
  )
}
