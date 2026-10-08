# FleetPulse – Logistics & Fleet Tracking
React 18 + TypeScript + Tailwind + React Router + Framer Motion + Zustand.

    npm install
    npm run dev      # development
    npm run build    # type-check + production build into dist/

Data flow: `data/mock.ts` → `services/` (async CRUD, in-memory) → `store/` (Zustand) → `pages/`.
Replace `api/client.ts` and `services/mockService.ts` with real HTTP calls to integrate a backend.
