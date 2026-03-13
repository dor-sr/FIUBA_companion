# Project Structure Guidelines

## Architecture
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Vanilla CSS (`globals.css` and CSS Modules as needed)
- **Linting/Formatting:** ESLint & Prettier

## Directory Layout
- `/app`: Next.js App Router pages and layout files.
- `/src/components`: Reusable UI components (buttons, schedule grids, etc.).
- `/src/lib`: Utility functions, SIU parsing logic, type definitions.
- `/Docs`: Development documentation (this directory).
- `/public`: Static assets like images and icons.
- `/rules`: Agent and IDE rules (e.g., Cursor MDC files).

## Rules
- Avoid scattering styles. Core styles should live in `globals.css` or dedicated module files.
- Favor server components where possible, use client components only for interactive elements.
- Ensure all logic for scraping or data fetching is isolated from UI components.
