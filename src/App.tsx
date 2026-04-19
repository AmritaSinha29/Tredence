import React from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { Workflow, LayoutDashboard, FileJson, PenTool, FolderOpen } from 'lucide-react';
import { DashboardPage } from './pages/DashboardPage';
import { TemplatesPage } from './pages/TemplatesPage';
import { DesignerPage } from './pages/DesignerPage';
import { WorkflowsPage } from './pages/WorkflowsPage';

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/workflows', icon: FolderOpen, label: 'Workflows' },
  { to: '/templates', icon: FileJson, label: 'Templates' },
  { to: '/designer', icon: PenTool, label: 'Designer' },
];

const App: React.FC = () => (
  <BrowserRouter>
    <div className="h-screen w-screen flex overflow-hidden bg-[#f5f6fa]">
      {/* ─── Sidebar Nav ─────────────────────────────────── */}
      <nav className="w-[220px] bg-white border-r border-[#e2e4ef] flex flex-col flex-shrink-0"
           role="navigation" aria-label="Main navigation">
        {/* Logo */}
        <div className="h-[52px] flex items-center gap-2.5 px-5 border-b border-[#e2e4ef] flex-shrink-0">
          <div className="w-8 h-8 rounded-md bg-[#0F3D4C] flex items-center justify-center shadow-sm">
            <Workflow size={16} className="text-white" />
          </div>
          <div>
            <h1 className="text-[13px] font-bold text-[#1e1f2e] leading-tight">HR Workflow</h1>
            <p className="text-[9px] text-[#b4b6c8] uppercase tracking-wider font-medium">Designer</p>
          </div>
        </div>

        {/* Nav Links */}
        <div className="flex-1 py-3 px-3">
          <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#b4b6c8] px-2 mb-2">Menu</p>
          <div className="space-y-0.5">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.to} to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2.5 rounded-md text-[13px] font-medium transition-colors ${
                    isActive
                      ? 'bg-[#F2F6F8] text-[#0F3D4C]'
                      : 'text-[#5a5c78] hover:bg-[#f8f9fc] hover:text-[#1e1f2e]'
                  }`
                }>
                <item.icon size={16} />
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-[#e2e4ef]">
          <p className="text-[10px] text-[#b4b6c8] text-center">Tredence Case Study</p>
          <p className="text-[9px] text-[#d0d3e4] text-center mt-0.5">v1.0.0</p>
        </div>
      </nav>

      {/* ─── Main Content ────────────────────────────────── */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-[52px] bg-white border-b border-[#e2e4ef] flex items-center px-5 flex-shrink-0">
          <Routes>
            <Route path="/dashboard" element={<PageTitle title="Dashboard" subtitle="Overview & quick actions" />} />
            <Route path="/workflows" element={<PageTitle title="Workflows" subtitle="All workflows in your organization" />} />
            <Route path="/templates" element={<PageTitle title="Templates" subtitle="Pre-built workflow patterns" />} />
            <Route path="/designer" element={<PageTitle title="Workflow Designer" subtitle="Drag-and-drop builder" />} />
            <Route path="*" element={<PageTitle title="Dashboard" subtitle="Overview & quick actions" />} />
          </Routes>
        </header>

        {/* Page Content */}
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/workflows" element={<WorkflowsPage />} />
          <Route path="/templates" element={<TemplatesPage />} />
          <Route path="/designer" element={<DesignerPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  </BrowserRouter>
);

const PageTitle: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => (
  <div>
    <h2 className="text-sm font-bold text-[#1e1f2e]">{title}</h2>
    <p className="text-[10px] text-[#8e90a6]">{subtitle}</p>
  </div>
);

export default App;
