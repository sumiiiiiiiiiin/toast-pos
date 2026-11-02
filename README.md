# Toast POS — Restaurant Order UI

A point-of-sale ordering and checkout interface for a chicken restaurant, built with React.
Designed in Figma first, then turned into a fully clickable, interactive prototype.

> This is a personal portfolio UI project and is not affiliated with Toast, Inc. or Uber.

## Features

### Ordering
- **Order types** — Dine In / Take Out / Uber Eats
  - `Happy Hour` and `Alcohol` categories are hidden automatically for Take Out and Uber Eats
  - Uber Eats orders add a $2 surcharge per item
- **Menu by category** — Combo, Chicken, Side, Sandwich, Special, Dipping, Beverage, Alcohol, Happy Hour, Free
- **Combo builder** — Solo / Duo / Trio / Party, each with its own number of chicken, side, and drink picks
- **Modifiers & notes** — item-specific modifiers (e.g. No Pickle, Sauce on the Side) plus `+ Add Note`
- **Cart management** — adjust quantity, repeat an item, remove lines
- **Server selection** and auto-incrementing ticket numbers

### Checkout
- Automatic subtotal, tax (13%), and total
- Payment methods: Card, Key in Card Number, Gift Card, Uber Eats
- Numeric keypad for amount tendered, plus quick-tender buttons (rounded up to the nearest $5)
- Any amount tendered over the balance is calculated as a tip
- Payment confirmation screen, then resets for the next order

### Layout
- Built on a fixed 1440 × 960 (3:2) design canvas that scales uniformly to fit any viewport,
  so the tablet POS layout looks the same on every screen

## Tech Stack

- [React 19](https://react.dev/)
- [Vite](https://vite.dev/)
- ESLint
- No UI library — inline styles and custom SVG icons

## Getting Started

```bash
# Install dependencies
npm install

# Start the dev server (http://localhost:5173)
npm run dev

# Build for production (outputs to dist/)
npm run build

# Preview the production build
npm run preview
```

## Project Structure

```
toast-pos/
├── index.html
├── public/              # favicon
├── src/
│   ├── main.jsx         # app entry point
│   ├── ToastPOS.jsx     # the full POS screen (menu data, state, components)
│   └── index.css
├── vite.config.js
└── package.json
```

Menu items, prices, and modifiers are defined at the top of `src/ToastPOS.jsx`
(`MENU`, `COMBO_SLOTS`, `MODIFIER_RULES`) and can be edited there directly.

## Author

**Sumin Seo** — UX/UI Designer
