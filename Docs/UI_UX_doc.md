# UI and UX Documentation

## Overview
FIUBA Companion is designed to be interactive, visually striking, and modern. 
It must appear "simple" to use but "imposing" aesthetically to attract university students.

## Core Design Principles
1. **Aesthetics:** Deep dark mode with vibrant, energetic accent colors matching a modern techy / engineering vibe.
2. **Glassmorphism:** Use blurred, translucent backgrounds for overlays, sidebars, and cards to create depth.
3. **Typography:** Clean, sans-serif fonts (e.g., Inter, Roboto, or Outfit) for readability and modern feel.
4. **Interactivity:** Micro-animations on hover and state changes. Dynamic feedback when selecting courses.
5. **No Tailwind:** Use Vanilla CSS for maximum flexibility and custom bespoke designs.

## Components
### Weekly Schedule (Cronograma Semanal)
- A highly interactive grid.
- Cards representing courses placed organically within time slots.
- **Dynamic Overlap Handling:** If multiple courses collide in the same time slot, the column width dynamically shares the space (50%, 33%, etc.).
- **Smart Days:** Saturday only renders if there's an active class scheduled on that day.
- **Subtle Glow:** Course blocks have an elegant, low-opacity drop-shadow glow matching their base color.

### SIU Import & Selection
- **SIU Modal:** Provides a simple paste-box for raw "Oferta de comisiones" data, immediately parsing it via regex.
- **Smart Search:** Search bar is completely accent-insensitive and dynamically shows a blurred, legible dropdown overlay.
- **Exclusive Accordion:** Selected courses stack on the sidebar. Clicking one expands its available commissions while collapsing others.
- **Commission Badges:** Real-time visual feedback using checkmarks and colored badges to outline schedules before inserting them into the main grid.
