# HR Workflow Designer

> A visual drag-and-drop HR workflow designer built with **React**, **TypeScript**, **React Flow**, and **Zustand**. Designed as a case study for Tredence Analytics.

![React](https://img.shields.io/badge/React-18-61dafb?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)
![React Flow](https://img.shields.io/badge/React_Flow-11-ff0072?logo=reactflow)
![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06b6d4?logo=tailwindcss)

---

## 🎯 Objective

Design and implement a mini HR Workflow Designer module where an HR admin can visually create and test internal workflows such as **onboarding**, **leave approval**, or **document verification**.

---

## 🚀 How to Run

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/hr-workflow-designer.git
cd hr-workflow-designer

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev

# 4. Open in browser
# → http://localhost:5173
```

---

## 🏗️ Architecture

### Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Build Tool | **Vite** | Fastest HMR, preferred by Tredence |
| UI Framework | **React 18 + TypeScript** | Strict type safety, modern hooks |
| Canvas | **React Flow v11** | Industry-standard workflow visualization |
| State | **Zustand** | Lightweight, no boilerplate, scalable |
| Styling | **TailwindCSS v4** | Utility-first, rapid iteration |
| Icons | **Lucide React** | Tree-shakeable, consistent |
| Layout | **Dagre** | Automatic DAG positioning |

### Folder Structure

```
src/
├── api/                  # Mock API layer (GET /automations, POST /simulate)
│   └── mockApi.ts
├── components/
│   ├── canvas/           # React Flow canvas wrapper
│   ├── nodes/            # 5 custom node components + registry
│   ├── forms/            # Node configuration forms + shared field components
│   ├── sidebar/          # Draggable node palette
│   └── sandbox/          # Validation + simulation panel
├── hooks/                # Custom hooks (automations, validation, undo/redo, auto-layout)
├── store/                # Zustand store (nodes, edges, undo stack, templates)
├── types/                # Discriminated union types for all node types
└── utils/                # Graph validation (DFS cycle detection), serialization, ID generator
```

### Key Design Decisions

1. **Discriminated Union Types** — Each node type has its own typed data interface (`StartNodeData`, `TaskNodeData`, etc.), enabling exhaustive `switch` matching and compile-time safety across all forms.

2. **Node Registry Pattern** — `nodeRegistry.ts` maps type strings to React components. Adding a new node type requires only: (a) a type, (b) a component, (c) a form, and (d) a registry entry. Zero framework changes needed.

3. **Zustand over Context** — Zustand provides atomic updates without React re-render cascading. The undo/redo stack uses deep-cloned snapshots for reliable state restoration.

4. **Local Mock API** — Instead of MSW (which requires service worker setup), the mock API uses async functions with simulated latency. Same API contract (`fetchAutomations()`, `simulateWorkflow()`), zero setup friction.

5. **Graph Validation Engine** — Custom DFS-based cycle detection + BFS reachability analysis. Validates: single start node, end node presence, no orphans, no cycles, required fields, edge constraints.

6. **Pastel Color Palette** — Soft, accessible colors for each node type: emerald (Start), blue (Task), amber (Approval), violet (Automated), rose (End). All backgrounds use lightened tints for visual harmony.

---

## ✅ Features Completed

### Core Requirements

| # | Feature | Status |
|---|---------|--------|
| 1 | **Workflow Canvas** — Drag-and-drop with 5 custom node types | ✅ |
| 2 | **Node Configuration Forms** — Type-specific sliding panel with all required fields | ✅ |
| 3 | **Mock API Layer** — `GET /automations` + `POST /simulate` with latency simulation | ✅ |
| 4 | **Sandbox Panel** — Validation + simulation with step-by-step execution timeline | ✅ |
| 5 | **Clean Architecture** — Separated concerns, typed interfaces, registry pattern | ✅ |

### Node Types & Forms

| Node Type | Form Fields |
|-----------|-------------|
| **Start** | Title, Metadata key-value pairs |
| **Task** | Title (required), Description, Assignee, Due Date, Custom Fields |
| **Approval** | Title, Approver Role (dropdown + custom), Auto-approve Threshold |
| **Automated Step** | Title, Action (fetched from API), Dynamic Parameters |
| **End** | End Message, Summary Toggle |

### Bonus Features

| Feature | Status |
|---------|--------|
| Export/Import workflow as JSON | ✅ |
| Pre-built workflow templates (Onboarding, Leave Approval) | ✅ |
| Undo/Redo (Ctrl+Z / Ctrl+Shift+Z) | ✅ |
| Mini-map | ✅ |
| Zoom controls | ✅ |
| Validation errors visually on nodes | ✅ |
| Auto-layout (Dagre algorithm) | ✅ |

---

## 🔮 What I'd Add With More Time

- **Node version history** — Track edit history per node with diff view
- **Conditional branching** — Decision/condition nodes with true/false edges
- **Drag handle indicators** — Visual drag affordance on palette items
- **Collaborative editing** — WebSocket-based real-time collaboration
- **Keyboard shortcuts panel** — Discoverable shortcut reference
- **Dark mode toggle** — Already architected for easy theme switching
- **E2E tests** — Cypress/Playwright for full workflow creation flows
- **Storybook** — Component documentation and visual testing

