# HR Workflow Designer

> A production-grade visual HR workflow designer built with **React 18**, **TypeScript**, **React Flow**, and **Zustand**. Designed as a full-stack case study for **Tredence Analytics**.

![React](https://img.shields.io/badge/React-18-61dafb?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)
![React Flow](https://img.shields.io/badge/React_Flow-11-ff0072?logo=reactflow)
![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06b6d4?logo=tailwindcss)
![Router](https://img.shields.io/badge/React_Router-7-ca4245?logo=reactrouter)

---

## 🎯 Objective

Design and implement an HR Workflow Designer module where an HR admin can visually create, configure, validate, and simulate internal workflows such as **onboarding**, **leave approval**, **document verification**, **exit processing**, and **performance reviews**.

---

## 🚀 How to Run

```bash
# 1. Clone the repository
git clone https://github.com/AmritaSinha29/Tredence.git
cd Tredence/hr-workflow-designer

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev

# 4. Open in browser
# → http://localhost:5173
```

---

## 📐 Application Sections

The app features a **multi-page layout** with sidebar navigation:

### 1. Dashboard (`/dashboard`)
- **Stats overview** — Active workflows, templates available, completed today, avg. completion time
- **Recent Workflows table** — Click any row to load that workflow in the Designer
- **Quick Actions** — New Workflow, Browse Templates, Open Designer
- **Node Types legend** — Visual reference for all 5 node types

### 2. Templates (`/templates`)
- **5 pre-built workflow templates** — each with step previews, tags, and node/edge counts
- Click **"Use Template"** to instantly load any template into the Designer
- Templates: Employee Onboarding, Leave Approval, Document Verification, Exit Process, Performance Review

### 3. Designer (`/designer`)
- **Drag-and-drop canvas** with React Flow — snap-to-grid, animated edges
- **Node palette sidebar** — drag any of the 5 node types onto the canvas
- **Configuration panel** — click any node to edit its type-specific form
- **Toolbar** — Undo/Redo, Auto Layout, Export/Import JSON, Clear
- **Sandbox modal** — Validate structure + Simulate execution with step-by-step timeline

---

## 🏗️ Architecture

### Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Build Tool | **Vite** | Fastest HMR, preferred by Tredence |
| UI Framework | **React 18 + TypeScript** | Strict type safety, modern hooks |
| Canvas | **React Flow v11** | Industry-standard workflow visualization |
| State | **Zustand** | Lightweight, no boilerplate, scalable |
| Routing | **React Router v7** | Client-side multi-page navigation |
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
│   ├── nodes/            # 5 custom node components + BaseNode + registry
│   ├── forms/            # Node configuration forms + shared field components
│   │   └── shared/       # FormField, KeyValueEditor (reusable)
│   ├── sidebar/          # Draggable node palette
│   └── sandbox/          # Validation + simulation panel + ExecutionTimeline
├── hooks/                # Custom hooks (automations, validation, undo/redo, auto-layout)
├── pages/                # Route pages
│   ├── DashboardPage.tsx # Stats, recent workflows, quick actions
│   ├── TemplatesPage.tsx # 5 pre-built workflow templates
│   └── DesignerPage.tsx  # Canvas + toolbar + sidebar + form panel
├── store/                # Zustand store (nodes, edges, undo stack, 5 templates)
├── types/                # Discriminated union types for all node types
└── utils/                # Graph validation (DFS/BFS), serialization, ID generator
```

### Key Design Decisions

1. **Discriminated Union Types** — Each node type has its own typed data interface (`StartNodeData`, `TaskNodeData`, etc.), enabling exhaustive `switch` matching and compile-time safety across all forms.

2. **Node Registry Pattern** — `nodeRegistry.ts` maps type strings to React components. Adding a new node type requires only: (a) a type, (b) a component, (c) a form, and (d) a registry entry.

3. **Zustand over Context** — Zustand provides atomic updates without React re-render cascading. The undo/redo stack uses deep-cloned snapshots for reliable state restoration.

4. **Local Mock API** — Async functions with simulated latency. Same API contract (`fetchAutomations()`, `simulateWorkflow()`), zero setup friction.

5. **Graph Validation Engine** — Custom DFS-based cycle detection + BFS reachability analysis. Validates: single start/end nodes, no orphans, no cycles, required fields, edge constraints.

6. **White/Grey/Lavender Theme** — Professional color palette with accessible contrast ratios, ARIA roles, `focus-visible` outlines, and `prefers-reduced-motion` support.

7. **Multi-Page Architecture** — React Router with sidebar navigation. Dashboard for overview, Templates for browsing, Designer for building — clean separation of concerns.

---

## ✅ Features Completed

### Core Requirements

| # | Feature | Status |
|---|---------|--------|
| 1 | **Workflow Canvas** — Drag-and-drop with 6 custom node types | ✅ |
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
| **Condition** | Variable Name, Logic Operator (>, <, ==, !=, contains), Target Value. Routes via True/False handles. |
| **Automated Step** | Title, Action (fetched from API), Dynamic Parameters |
| **End** | End Message, Summary Toggle |

### Pre-built Templates

| Template | Nodes | Description |
|----------|-------|-------------|
| Employee Onboarding | 6 | Document collection → Manager approval → Welcome email → IT setup |
| Leave Approval | 7 | Submit → Manager review → HR verification → Update balance → Notify team |
| Document Verification | 5 | OCR scan → Manual review → Compliance sign-off |
| Remote Equipment Request | 7 | Submit → Condition (Is Remote?) → True (Ship laptop) / False (Pickup at desk) → End |
| Exit Process | 8 | Asset return → Knowledge transfer → Exit interview → Settlement → Revoke access |
| Performance Review | 7 | Self assessment → Peer feedback → Manager rating → Calibration → Report |

### Bonus Features

| Feature | Status |
|---------|--------|
| Export/Import workflow as JSON | ✅ |
| 5 pre-built workflow templates | ✅ |
| Undo/Redo (Ctrl+Z / Ctrl+Y) | ✅ |
| Mini-map | ✅ |
| Zoom controls | ✅ |
| Validation errors visually on nodes | ✅ |
| Auto-layout (Dagre algorithm) | ✅ |
| Multi-page layout with Dashboard | ✅ |
| Interactive stats & recent workflows | ✅ |
| ARIA accessibility + keyboard support | ✅ |

---

## ♿ Accessibility

- Semantic HTML: `<header>`, `<nav>`, `<main>`, `<aside>`, `<table>`
- ARIA roles: `toolbar`, `dialog`, `navigation`, `alert`, `complementary`
- All interactive elements have `aria-label` attributes
- `focus-visible` outline for keyboard users
- `prefers-reduced-motion` media query support
- Proper `label[htmlFor]` associations on form fields

---

## 🔮 What I'd Add With More Time

- **Collaborative editing** — WebSocket-based real-time collaboration
- **Backend persistence** — Connect mock API to PostgreSQL/Supabase
- **E2E tests** — Cypress/Playwright for full workflow creation flows
- **Storybook** — Component documentation and visual testing
- **Dark mode toggle** — Already architected for easy theme switching
