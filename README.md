# AI Journal Companion

A calming AI-supported journal that pairs daily reflection with gentle habit and goal coaching. The app is built with React, TypeScript, Tailwind CSS, and Vite.

## Prerequisites

- Node.js 18 or later
- npm 9 or later (ships with recent Node releases)

## Getting started

1. Open a terminal (Command Prompt on Windows, Terminal app on macOS, or any shell on Linux) and change into the project folder, e.g.:
   ```bash
   cd path/to/AI-Journal-
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server from that same terminal window:
   ```bash
   npm run dev
   ```
4. Open the app in your browser at the URL printed in the terminal (defaults to http://localhost:5173).

While the dev server is running, the UI will live-reload as you edit files in `src/`.

## Available scripts

| Command          | Description                                      |
| ---------------- | ------------------------------------------------ |
| `npm run dev`    | Start the Vite development server.               |
| `npm run build`  | Create a production build in `dist/`.            |
| `npm run preview`| Preview the production build locally.            |
| `npm run lint`   | Run ESLint with the project configuration.       |

## Project structure

- `src/App.tsx` wires up the main layout.
- `src/components/` houses the companion cards (hero, check-in, habit coach, journal entry, trackers, and more).
- `src/hooks/` contains reusable hooks for fetching and storing day data.
- `src/data/` stores seed data such as default habits.

Feel free to adjust the copy and styling in the components to match the tone you want for your journal.
