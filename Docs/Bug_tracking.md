# Bug Tracking

## Format
Record any bugs and issues encountered during development here.
Use the following format for each bug:
- **Date:** [YYYY-MM-DD]
- **Bug Description:** [What went wrong]
- **Root Cause:** [Why it happened]
- **Resolution:** [How it was fixed]

---

## Known Bugs
(No known bugs yet)

## Resolved Bugs

- **Date:** 2026-03-12
- **Bug Description:** ScheduleGrid layout completely broke when "Sábado" was visually hidden from the grid.
- **Root Cause:** The `grid-template-columns` property in `ScheduleGrid.module.css` was hardcoded to 6 days. When the React component conditionally rendered 5 days, the CSS Grid algorithm forced rows into empty column slots, destroying the grid architecture.
- **Resolution:** Removed the hardcoded `grid-template-columns` from CSS and applied it dynamically via inline styles referencing `days.length` in `ScheduleGrid.tsx`.
