import { useState } from 'react'
import { GAME_RATINGS, SOCIAL_APPS, DESCRIPTORS, judge } from './data.js'
import Flow from './Flow.jsx'

const STATUS_LABEL = { good: 'OK', guidance: 'With guidance', no: 'Not yet' }

function Row({ item, mode, selected, onSelect, level }) {
  const isGame = mode === 'games'
  return (
    <button
      className={`row ${isGame ? '' : 'row-social'} ${selected ? 'is-selected' : ''}`}
      style={isGame ? { '--c': item.color } : undefined}
      onClick={onSelect}
      aria-pressed={selected}
    >
      <span className="ring">
        {isGame ? (
          <img src={item.badge} alt={`PEGI ${item.age}`} className="ring-badge" />
        ) : (
          <img src={item.icon} alt="" className="ring-icon" />
        )}
      </span>
      <span className="banner">
        <span className="banner-text">
          {isGame ? item.short : item.name}
          {!isGame && <small>{item.short}</small>}
        </span>
        <span className="banner-end">
          {level && <span className={`status ${level}`}>{STATUS_LABEL[level]}</span>}
          {!isGame && <span className="age-pill">{item.ageLabel || `${item.age}+`}</span>}
        </span>
      </span>
    </button>
  )
}

function Detail({ item, mode }) {
  const isGame = mode === 'games'
  return (
    <article className="detail" key={item.id}>
      <header className="detail-head">
        {isGame ? (
          <img src={item.badge} alt={`PEGI ${item.age}`} className="detail-badge" />
        ) : (
          <img src={item.icon} alt="" className="detail-icon" />
        )}
        <div>
          <h2>{isGame ? `PEGI ${item.age}` : item.name}</h2>
          <p className="lead">{isGame ? item.short : item.ageLabel ? 'Made for children under 13' : `Minimum age ${item.age}`}</p>
        </div>
      </header>

      <p>{item.summary}</p>

      <h3>What to expect</h3>
      <ul>{item.expect.map((t) => <li key={t}>{t}</li>)}</ul>

      {isGame ? (
        <>
          <h3>Content descriptors you may see</h3>
          <div className="chips">{item.descriptors.map((d) => <span key={d} className="chip">{d}</span>)}</div>
          <h3>Example games</h3>
          <p className="muted">{item.examples.join(', ')}. Ratings can differ between versions, so check the box.</p>
          <h3>UK law</h3>
          <p>{item.law}</p>
        </>
      ) : (
        <>
          <h3>Worth watching</h3>
          <ul>{item.watch.map((t) => <li key={t}>{t}</li>)}</ul>
          <h3>Settings to check</h3>
          <ul>{item.controls.map((t) => <li key={t}>{t}</li>)}</ul>
        </>
      )}

      <div className="tip"><strong>{isGame ? 'Parent tip:' : 'Parent tip:'}</strong> {item.tip}</div>
    </article>
  )
}

function verdictText(level, age, item, isGame) {
  const label = isGame ? `PEGI ${item.age}` : item.name
  if (level === 'good' && !isGame && item.maxAge && age > item.maxAge) {
    return {
      title: 'Safe, but aimed younger',
      body: `${label} is made for children under 13, and at ${age} they may find it too young. The main YouTube app with a supervised account is usually the next step.`,
    }
  }
  if (level === 'good') {
    return {
      title: 'Good to go',
      body: isGame
        ? `At ${age}, ${label} is within the age rating. It is still worth a look at the content descriptors.`
        : `At ${age}, ${label} meets the minimum age of ${item.age}. Set up the privacy settings before they start.`,
    }
  }
  if (level === 'guidance') {
    return {
      title: 'Okay with guidance',
      body: `At ${age}, ${label} is just under the rating. Most families are comfortable with this if a parent checks the content first and stays nearby.`,
    }
  }
  return {
    title: 'Not recommended yet',
    body: isGame
      ? `${label} is aimed at ${item.age}+ and ${age} is too far below that. ${item.age >= 16 ? 'It is also legally restricted for sale in the UK.' : 'Look for a lower-rated game instead.'}`
      : `${label} requires users to be ${item.age}+. Below that, accounts can be removed and the app is not designed for younger children.`,
  }
}

function Quiz({ mode, items, selected, setSelectedId, age, setAge, n }) {
  const isGame = mode === 'games'
  const level = n ? judge(n, selected) : null
  const v = level ? verdictText(level, n, selected, isGame) : null

  return (
    <section className="quiz" aria-labelledby="quiz-title">
      <h2 id="quiz-title">Quick check</h2>
      <label className="field">
        <span>{isGame ? 'How old is the player?' : 'How old is the person who wants to use it?'}</span>
        <input
          type="number"
          inputMode="numeric"
          min="1"
          max="120"
          placeholder="Enter age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
      </label>
      <label className="field">
        <span>{isGame ? 'Game age rating' : 'Which app?'}</span>
        <select value={selected.id} onChange={(e) => setSelectedId(isGame ? Number(e.target.value) : e.target.value)}>
          {items.map((i) => (
            <option key={i.id} value={i.id}>
              {isGame ? `PEGI ${i.age}` : `${i.name} (${i.ageLabel || `${i.age}+`})`}
            </option>
          ))}
        </select>
      </label>
      <div className={`result ${level || 'empty'}`} aria-live="polite">
        {v ? (
          <>
            <strong>{v.title}</strong>
            <p>{v.body}</p>
          </>
        ) : (
          <p>Enter an age to see if it is OK.</p>
        )}
      </div>
    </section>
  )
}

function Descriptors() {
  return (
    <section className="desc-grid" aria-label="PEGI content descriptors">
      {DESCRIPTORS.map((d) => (
        <article key={d.name} className="desc-card">
          <h3>{d.name}</h3>
          <p>{d.text}</p>
        </article>
      ))}
      <p className="desc-note">
        These appear as icons on the back of a game box and on digital store pages. The age rating shows how suitable the game is. The descriptors show why it got that rating.
      </p>
    </section>
  )
}

function openPrint() {
  const url = new URL(`${import.meta.env.BASE_URL}print.png`, window.location.href).href
  const w = window.open('', '_blank')
  if (!w) {
    window.location.href = url
    return
  }
  w.document.write(
    `<!doctype html><title>Print</title><style>@page{margin:0}body{margin:0}img{display:block;width:100%}</style><img src="${url}" alt="" onload="setTimeout(function(){window.print()},250)">`
  )
  w.document.close()
}

export default function App() {
  const [mode, setMode] = useState('games')
  const [gameId, setGameId] = useState(12)
  const [appId, setAppId] = useState('instagram')
  const [age, setAge] = useState('')

  const parsed = parseInt(age, 10)
  const n = Number.isFinite(parsed) && parsed >= 1 && parsed <= 120 ? parsed : null

  const isGame = mode === 'games'
  const items = isGame ? GAME_RATINGS : SOCIAL_APPS
  const selected = isGame ? GAME_RATINGS.find((r) => r.id === gameId) : SOCIAL_APPS.find((a) => a.id === appId)
  const setSelectedId = isGame ? setGameId : setAppId

  return (
    <div className="page">
      <header className="top">
        <img src={`${import.meta.env.BASE_URL}waypoint-logo.png`} alt="Waypoint for Education" className="logo" />
        <div className="top-text">
          <h1>Age Guide</h1>
          <p>What video game ratings and social media minimum ages mean.</p>
        </div>
        <button className="print-btn" onClick={openPrint}>Print</button>
      </header>

      <div className="tabs" role="tablist">
        <button role="tab" aria-selected={mode === 'games'} className={`pill ${mode === 'games' ? 'on' : ''}`} onClick={() => setMode('games')}>
          Video Games
        </button>
        <button role="tab" aria-selected={mode === 'social'} className={`pill ${mode === 'social' ? 'on' : ''}`} onClick={() => setMode('social')}>
          Social Media
        </button>
        <button role="tab" aria-selected={mode === 'descriptors'} className={`pill ${mode === 'descriptors' ? 'on' : ''}`} onClick={() => setMode('descriptors')}>
          Content Descriptors
        </button>
        <button role="tab" aria-selected={mode === 'flow'} className={`pill ${mode === 'flow' ? 'on' : ''}`} onClick={() => setMode('flow')}>
          Test Yourself
        </button>
      </div>

      {mode === 'descriptors' ? (
        <Descriptors />
      ) : mode === 'flow' ? (
        <Flow />
      ) : (
        <div className="layout">
          <div className="col-left">
            <div className="panel">
              <div className="rows">
                {items.map((it) => (
                  <Row
                    key={it.id}
                    item={it}
                    mode={mode}
                    selected={it.id === selected.id}
                    onSelect={() => setSelectedId(it.id)}
                    level={n ? judge(n, it) : null}
                  />
                ))}
              </div>
            </div>
            <div className="panel panel-quiz">
              <Quiz mode={mode} items={items} selected={selected} setSelectedId={setSelectedId} age={age} setAge={setAge} n={n} />
            </div>
          </div>

          <main className="col-right">
            <Detail item={selected} mode={mode} />
          </main>
        </div>
      )}

      <footer className="foot">
        Ratings and ages are a guide. Parents and carers know the child best. PEGI is a trademark of Interactive Software Federation of Europe.
      </footer>
    </div>
  )
}
