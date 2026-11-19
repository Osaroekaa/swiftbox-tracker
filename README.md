# SwiftBox Real-Time Shipment Tracker

A React single-page app that lets SwiftBox Couriers customers look up the status of a shipment without page reloads.

This repository currently covers **Task 1: Project Architecture and Routing Setup**: an app shell with client-side routing and a responsive layout. Tracking logic and the mock API arrive in Task 2; performance and accessibility work in Task 3.

## Tech stack

- Vite + React + TypeScript
- React Router (client-side routing)
- CSS for the global stylesheet
- ESLint

## Prerequisites

- Node.js 20.19 or newer in the 20.x line, or 22.12 or newer
- npm

## Installation

From the project directory:

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open the local address printed in the terminal (usually http://localhost:5173).

No environment variables are needed at this stage.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the dev server with hot reload |
| `npm run build` | Type-checks and creates a production build in `dist/` |
| `npm run preview` | Serves the production build locally |
| `npm run lint` | Runs ESLint |

## Routes

| Path | Page |
| --- | --- |
| `/` | Home |
| `/tracking` | Tracking (form arrives in Task 2) |
| `*` | 404 page for any unknown address |

The header, navigation and footer live in a shared layout, so they stay on screen while only the page content changes.

## Project structure

```
src/
  components/   Shared layout, header and footer
  pages/        Home, tracking and not-found screens
  index.css     Global styles, imported by main.tsx
  main.tsx      Application entry point
  router.tsx    Route definitions
  App.tsx       App shell that renders the router
```
