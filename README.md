# SwiftBox Real-Time Shipment Tracker

A React single-page app that lets SwiftBox Couriers customers look up the status of a shipment without page reloads.

This repository covers **Task 1** (project architecture and routing) and **Task 2** (shipment tracking logic and API integration): an app shell with client-side routing, plus a tracking form that looks up a shipment from mock data and shows loading, success and error states.

## Tech stack

- Vite + React + TypeScript
- React Router (client-side routing)
- Axios (data fetching)
- Faker.js (mock data generation)
- Vitest + React Testing Library (testing)
- CSS Modules for component styles, plus one global stylesheet
- ESLint

## Prerequisites

- Node.js 20.19 or newer in the 20.x line, or 22.12 or newer
- npm

## Installation

1. Clone the repository and move into its directory:
   ```bash
   git clone https://github.com/osaroekaa/swiftbox-tracker.git
   cd swiftbox-tracker
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open the local address printed in the terminal (usually http://localhost:5173).

No environment variables are needed at this stage.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the dev server with hot reload |
| `npm run build` | Type-checks and creates a production build in `dist/` |
| `npm run preview` | Serves the production build locally |
| `npm run lint` | Runs ESLint |
| `npm run generate:data` | Regenerates the mock shipment data |
| `npm run test` | Runs Vitest in watch mode |
| `npm run test:run` | Runs the tests once |

## Routes

| Path | Page |
| --- | --- |
| `/` | Home |
| `/tracking` | Tracking form and result card |
| `*` | 404 page for any unknown address |

The header, navigation and footer live in a shared layout, so they stay on screen while only the page content changes.

## Tracking a shipment

Tracking numbers are `SB` followed by 8 digits, for example `SB10000003`. Case and surrounding spaces are ignored.

The mock data contains 25 shipments, `SB10000001` to `SB10000025`, spread across every status. Try these:

| Tracking number | Result |
| --- | --- |
| `SB10000001` | Processing |
| `SB10000003` | In transit |
| `SB10000005` | Delivered |
| `SB99999999` | Valid format, but not found |
| `abc` | Rejected by form validation |

## Mock data and testing

`npm run generate:data` uses Faker with a fixed seed to write `public/mock/shipments.json`. The output is identical on every run, so the tests never depend on random data. The service fetches that file with Axios, so it works the same in development and after deployment.

The service reports three kinds of failure: an invalid ID format, a shipment that is not found, and a service or data problem. The form shows a different message for each.

Run the unit tests with `npm run test:run`. They cover ID validation, data parsing, and the fetch logic (success, not found, invalid ID, network failure, malformed data), with Axios mocked.

## Project structure

```
scripts/        generate-shipments.mjs, the mock data generator
public/mock/    shipments.json, the generated mock API data
src/
  components/   Layout, header, footer and the shipment result card
  pages/        Home, tracking and not-found screens
  hooks/        useShipmentLookup, which tracks loading, success and error
  services/     shipmentService (fetching, validation, parsing) and its types and tests
  test/         Vitest setup
  index.css     Global styles
  router.tsx    Route definitions
```

## Design decisions

### State management

- **No global store.** Shipment lookup is the app's shared behavior, so it uses component state and the `useShipmentLookup` hook instead of Redux or Context.
- **One state object.** The hook stores one `phase` (`idle`, `loading`, `success` or `error`) instead of separate flags. This prevents incompatible UI states, and the discriminated union only exposes `shipment` in the success state.
- **Stale responses are ignored.** Each search gets an identifier, and only the latest search can update the state. Leaving the page also invalidates any search still in flight.
- **The URL controls navigation.** React Router owns the current page, and the mobile menu closes when the path changes.

### Structure

Pages render the UI, the `useShipmentLookup` hook manages lookup state, and the shipment service owns fetching, validation and parsing. The service uses distinct errors for invalid IDs, missing shipments and service/data failures so the UI can show an appropriate message.

### Performance

- **Load tracking on demand.** The router dynamically imports the tracking page, keeping its code out of the initial home-page load.
- **Keep assets simple.** The app uses a system font stack and CSS Modules, without external web fonts or content images.
- **Use a local mock API.** Shipment data is fetched from a JSON file served by the app, requiring no separate API server.

### Accessibility

- Semantic `header`, `nav`, `main` and `footer` landmarks, plus a skip link to the main content.
- The tracking form has a label, and its hint and validation error are linked with `aria-describedby`; invalid input is marked with `aria-invalid`.
- Loading and error messages are announced with live regions (`role="status"` and `role="alert"`).
- Focus moves to the main content after navigation, returns to the tracking input after an invalid submit, and returns to the menu button when Escape closes the mobile menu.
- Focus-visible outlines are provided, and animations are disabled for people who prefer reduced motion.

### Testing

The shipment generator uses a fixed Faker seed and reference date, so generated data stays consistent. The Vitest suite has 20 test cases covering ID normalization and validation, shipment parsing, and fetch success and failure behavior, with Axios mocked.

### Trade-offs

The tracking page is split into a separate chunk, which requires an additional request when it is loaded. The app currently uses static mock data and does not include live polling or a retry button.
