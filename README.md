# FIUBA Companion

A planning workspace for FIUBA students to reason about schedules, curriculum progress, and academic dates before enrollment chaos starts.

The app is in Spanish because the workflow is local to FIUBA, but the repo is kept readable for anyone who wants to inspect or adapt the product pattern.

## What it does

- **Cronograma interactivo** — model course schedule combinations before committing to SIU enrollment.
- **Plan de estudios** — explore curriculum state, correlativities, and degree progress.
- **Agenda académica** — keep the official academic calendar close to the planning flow.
- **SIU data parsing** — includes scripting hooks for transforming defaults into usable app data.

## Stack

- Next.js 16
- React 19
- TypeScript
- CSS Modules
- `html2canvas` + `jspdf` for export-oriented flows

## Run locally

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

Useful commands:

```bash
npm run lint
npm run build
npm run parse-siu
```

## Repository map

```text
src/app/                 App routes
src/components/          Schedule and curriculum UI
scripts/                 Data parsing utilities
Docs/                    Implementation notes, UX notes, and bug tracking
public/                  Static assets
```

## Status

This is an active student-product experiment, not a polished commercial release. The next cleanup pass is focused on screenshots, deployed demo links, and clearer data-import instructions.
