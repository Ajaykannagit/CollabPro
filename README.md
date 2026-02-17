# CollabPro: University–Industry Synergy Ecosystem

CollabPro is a high-performance digital ecosystem designed to bridge the structural gap between academic research and industrial application. It acts as a centralized hub where universities showcase their intellectual capital and corporations publish real-world R&D challenges.

> [!NOTE]
> **Demo Mode**: This version of CollabPro is configured to run in **Local Demo Mode**. It uses an in-memory mock backend system (`lib/demoBackend.ts`) and does not require a live database connection or Supabase account.

---

## Project Overview

1. **Discovery**: Universities list cutting-edge research; industry partners publish specific challenges.
2. **AI Matchmaking**: Algorithms score compatibility based on expertise, resources, and constraints.
3. **Negotiation & Scoping**: Secure messaging and scoping tools define the partnership.
4. **Legal & Compliance**: Agreement generation and digital signatures streamline approvals.
5. **Execution Management**: Milestone, budget, and team progress tracking in a unified workspace.
6. **Commercialization**: Licensing marketplace and IP tracking to take research to market.

---

## Getting Started: Installation & Execution

### 1. Prerequisites

- **Node.js** v18+  
- **npm** (bundled with Node.js)  
- **Git**  

### 2. Download the Project

```bash
git clone https://github.com/Ajaykannagit/CollabPro.git
cd CollabPro
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Application

```bash
npm run dev
```

Open the app at `http://localhost:5173`. No environment variables or database setup are required for this release.

---

## Tech Stack (v1.1.0)

| Technology          | Purpose          | Implementation                                                  |
| ------------------- | ---------------- | -------------------------------------------------------------- |
| **React 19**        | UI Framework     | Modern hooks-based patterns and concurrent rendering.          |
| **Vite**            | Build Tool       | Fast development server and optimized production builds.       |
| **Mock Backend**    | Data Persistence | Simulated Supabase API via `lib/supabase.ts` & `demoBackend.ts`.|
| **Zustand**         | State Management | Global state with localStorage persistence for user profiles.  |
| **Tailwind CSS**    | Styling          | Utility-first CSS for a premium, responsive interface.         |
| **Framer Motion**   | Animations       | Smooth transitions and micro-interactions.                     |
| **Dexie.js**        | Local DB         | IndexedDB wrapper for complex client-side data queries.        |

---

## Quality & Developer Workflow

### Testing
```bash
npm test
```
Vitest covers core logic, repositories, and UI utilities.

### Linting & Type Safety
```bash
npm run lint   # ESLint + TypeScript rules
npm run build  # Verification build
```

---

## Project Architecture

```text
CollabPro/
  actions/                      # Data actions (mapped to local mock backend)
  app/                          # Application shell and routing
  components/                   # Feature and UI components
    ui/                         # Design system primitives
  lib/                          # Store, types, mock backend, and local storage logic
  hooks/                        # Custom hooks (toast, state management)
  tests/                        # Vitest unit and integration tests
```

---

## Version History

### v1.1.0 (2026-02-17)
- **Local-First Rebuild**: Completed removal of Supabase dependency. Application now runs 100% locally for demo purposes.
- **Functional Profile**: Implemented a full user profile module with `localStorage` persistence.
- **Enhanced Workspace**: Fixed infinite loading states and enriched project views with activity logs and data relationships.
- **UI Stabilization**: Conducted global button audit, removed all "Coming soon" placeholders, and fixed linting errors.

### v1.0.0 (Initial Release)
- Core framework with academic/corporate partner discovery and project management tools.

---

## License
Distributed under the **MIT License**.
