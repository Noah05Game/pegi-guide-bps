# Age Guide - Waypoint for Education

A React (Vite, plain JavaScript) app for PEGI game ratings and social media minimum ages.

- Tap a rating or app to see everything about it
- Quick check: enter an age, pick a rating or app, get a verdict (Good to go / Okay with guidance / Not recommended)
- Content Descriptors tab explains the PEGI descriptors (violence, fear, in-game purchases, etc.)
- Once an age is entered, every rating or app shows OK / With guidance / Not yet
- Print button opens and prints `public/print.png`
- Test Yourself tab: Flow AI check of a person's own games and apps
- Lenient: e.g. an 11-year-old gets "Okay with guidance" on PEGI 12

## Flow (powered by 05 AI)

The **Test Yourself** tab runs Flow. You enter an age and a list of games and apps, and Flow (via Pollinations) finds each rating, compares it with the age and turns green, amber or red with feedback.

1. Get a key at https://enter.pollinations.ai
2. Open `.env` and replace `PASTE_YOUR_KEY_HERE` with it (keep the `sk_` start, e.g. `VITE_POLLINATIONS_KEY=sk_abc...`)
3. Restart `npm run dev` (Vite only reads `.env` at start-up)

Flow works in two steps. First a **web-search model**, run once per title, (`VITE_POLLINATIONS_SEARCH_MODEL`, default `gemini-search`, then `perplexity-fast` and `perplexity-reasoning` as fallbacks, tried until an official rating is found) looks up each title's real rating on pegi.info, game stores and official app pages, so new releases are handled. Then the judging model (`VITE_POLLINATIONS_MODEL`) writes the feedback from that research. There is no built-in list of games.

`VITE_POLLINATIONS_MODEL` defaults to `openai`. Change it to any text model listed at https://gen.pollinations.ai/v1/models.

**Security:** anything starting `VITE_` is baked into the page, so a `sk_` secret key can be read by anyone who opens the built site. That is fine on your own computer. Before putting it online, use a restricted/publishable key or add a small server that holds the key.

## Print button

The Print button opens `public/print.png` and starts printing. Replace that file with your design (it is a placeholder right now).

## Install

1. Install Node.js 18 or newer from https://nodejs.org (check with `node -v`).
2. Unzip this folder and open a terminal inside it.
3. Install dependencies:  `npm install`
4. Start the dev server:  `npm run dev`
5. Open the address it prints (usually http://localhost:5173).

## Build for hosting

`npm run build` creates a `dist/` folder. Upload it to any static host (GitHub Pages, Netlify, etc.). Preview it locally with `npm run preview`.

## Editing

- `src/data.js` - all ratings, app ages, descriptions and the leniency setting (`lenient` = years under the rating that still count as "Okay with guidance"; PEGI 18 and the social apps are 0)
- `src/App.jsx` - layout and quiz
- `src/styles.css` - colours and styling
- `public/pegi/` and `public/apps/` - your badge and app icons (replace files with the same names to swap them)
- `public/waypoint-logo.png` and `public/favicon.png` - branding

## Deploy to GitHub Pages (GitHub Actions)

1. Push this project to a repo, branch `main` (`.env` is git-ignored, so it stays off GitHub).
2. Repo > Settings > Secrets and variables > Actions > New repository secret. Add `VITE_POLLINATIONS_KEY`, `VITE_POLLINATIONS_MODEL` and `VITE_POLLINATIONS_SEARCH_MODEL`.
3. Repo > Settings > Pages > Source: **GitHub Actions**.
4. Push to `main` (or run the workflow from the Actions tab). The site appears at `https://<username>.github.io/<repo>/`.

The key is built into the published site, so use a publishable key and keep the credit balance small.
