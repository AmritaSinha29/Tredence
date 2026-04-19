import React, { useState, useRef } from 'react';
import {
  Undo2, Redo2, Download, Upload, FlaskConical, LayoutGrid,
  FileJson, Trash2, Workflow,
} from 'lucide-react';
import { ReactFlowProvider } from 'reactflow';
import { WorkflowCanvas } from './components/canvas/WorkflowCanvas';
import { NodePalette } from './components/sidebar/NodePalette';
import { NodeFormPanel } from './components/forms/NodeFormPanel';
import { SandboxPanel } from './components/sandbox/SandboxPanel';
import { useWorkflowStore } from './store/workflowStore';
import { useUndoRedo } from './hooks/useUndoRedo';
import { useAutoLayout } from './hooks/useAutoLayout';
import { exportWorkflowToFile, importWorkflowFromFile } from './utils/serializer';

const App: React.FC = () => {
  const [sandboxOpen, setSandboxOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const selectedNodeId = useWorkflowStore((s) => s.selectedNodeId);
  const serialize = useWorkflowStore((s) => s.serialize);
  const importWorkflow = useWorkflowStore((s) => s.importWorkflow);
  const clearWorkflow = useWorkflowStore((s) => s.clearWorkflow);
  const loadTemplate = useWorkflowStore((s) => s.loadTemplate);
  const pushSnapshot = useWorkflowStore((s) => s.pushSnapshot);

  const { undo, redo, canUndo, canRedo } = useUndoRedo();
  const { getLayoutedElements } = useAutoLayout();

  const handleExport = () => exportWorkflowToFile(serialize('My Workflow'));

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const wf = await importWorkflowFromFile(file);
    if (wf) importWorkflow(wf); else alert('Invalid workflow file.');
    e.target.value = '';
  };

  const handleAutoLayout = () => {
    pushSnapshot();
    const { nodes: ln, edges: le } = getLayoutedElements(nodes, edges);
    importWorkflow({ version: '1.0.0', name: '', nodes: ln, edges: le, createdAt: '', updatedAt: '' });
  };

  return (
    <ReactFlowProvider>
      <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#f5f6fa]">
        {/* ─── Header ──────────────────────────────────────── */}
        <header className="h-[52px] bg-white border-b border-[#e2e4ef] flex items-center justify-between px-4 flex-shrink-0 z-20"
                role="banner">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#7c6cf0] flex items-center justify-center shadow-sm">
              <Workflow size={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-[13px] font-bold text-[#1e1f2e] leading-tight">HR Workflow Designer</h1>
              <p className="text-[10px] text-[#b4b6c8]">Visual Process Builder</p>
            </div>
          </div>

          {/* Toolbar */}
          <nav className="flex items-center gap-0.5" role="toolbar" aria-label="Workflow actions">
            <Btn icon={<Undo2 size={15} />} label="Undo" onClick={undo} disabled={!canUndo} shortcut="Ctrl+Z" />
            <Btn icon={<Redo2 size={15} />} label="Redo" onClick={redo} disabled={!canRedo} shortcut="Ctrl+Y" />
            <Sep />
            <Btn icon={<LayoutGrid size={15} />} label="Auto Layout" onClick={handleAutoLayout} />
            <Sep />
            <Btn icon={<Download size={15} />} label="Export" onClick={handleExport} />
            <Btn icon={<Upload size={15} />} label="Import" onClick={() => fileInputRef.current?.click()} />
            <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" aria-hidden="true" />
            <Sep />
            <Btn icon={<FileJson size={15} />} label="Onboarding" onClick={() => loadTemplate('onboarding')} accent />
            <Btn icon={<FileJson size={15} />} label="Leave Approval" onClick={() => loadTemplate('leave-approval')} accent />
            <Sep />
            <Btn icon={<Trash2 size={15} />} label="Clear All" onClick={clearWorkflow} danger />
          </nav>

          {/* CTA */}
          <button onClick={() => setSandboxOpen(true)}
            className="flex items-center gap-2 px-4 py-[7px] bg-[#7c6cf0] hover:bg-[#6354d4]
                       text-white rounded-lg text-sm font-semibold transition-colors shadow-sm
                       focus-visible:ring-2 focus-visible:ring-[#ece9fd] focus-visible:ring-offset-2"
            aria-label="Open workflow sandbox">
            <FlaskConical size={15} /> Test Workflow
          </button>
        </header>

        {/* ─── Main ────────────────────────────────────────── */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <aside className="w-52 bg-white border-r border-[#e2e4ef] flex flex-col flex-shrink-0"
                 role="navigation" aria-label="Node palette">
            <div className="flex-1 overflow-y-auto p-3.5">
              <NodePalette />

              <div className="mt-5 pt-4 border-t border-[#e2e4ef]">
                <h3 className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8e90a6] mb-2">
                  Statistics
                </h3>
                <div className="space-y-1">
                  <StatRow label="Nodes" value={nodes.length} />
                  <StatRow label="Connections" value={edges.length} />
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-[#e2e4ef]">
                <h3 className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8e90a6] mb-2">
                  Quick Tips
                </h3>
                <ul className="space-y-0.5 text-[10px] text-[#8e90a6] list-none">
                  <li>• Drag nodes onto canvas</li>
                  <li>• Drag handles to connect</li>
                  <li>• Click a node to configure</li>
                  <li>• Backspace to delete</li>
                  <li>• Ctrl+Z / Ctrl+Y for undo/redo</li>
                </ul>
              </div>
            </div>
          </aside>

          {/* Canvas */}
          <WorkflowCanvas />

          {/* Form Panel */}
          {selectedNodeId && <NodeFormPanel />}
        </div>

        {/* Sandbox Modal */}
        <SandboxPanel isOpen={sandboxOpen} onClose={() => setSandboxOpen(false)} />
      </div>
    </ReactFlowProvider>
  );
};

/* ─── Toolbar Sub-components ───────────────────────────── */
const Btn: React.FC<{
  icon: React.ReactNode; label: string; onClick: () => void;
  disabled?: boolean; accent?: boolean; danger?: boolean; shortcut?: string;
}> = ({ icon, label, onClick, disabled, accent, danger, shortcut }) => (
  <button onClick={onClick} disabled={disabled}
    title={shortcut ? `${label} (${shortcut})` : label}
    aria-label={label}
    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors
      disabled:opacity-25 disabled:cursor-not-allowed
      ${danger
        ? 'text-[#e04e5e] hover:bg-[#fef0f1]'
        : accent
          ? 'text-[#7c6cf0] hover:bg-[#f5f3fe]'
          : 'text-[#5a5c78] hover:bg-[#f0f1f8] hover:text-[#1e1f2e]'
      }`}>
    {icon}
    <span className="hidden xl:inline">{label}</span>
  </button>
);

const Sep = () => <div className="w-px h-5 bg-[#e2e4ef] mx-1" aria-hidden="true" />;

const StatRow: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="flex items-center justify-between px-2.5 py-1.5 rounded-md bg-[#f8f9fc]">
    <span className="text-[10px] text-[#8e90a6]">{label}</span>
    <span className="text-xs font-semibold text-[#1e1f2e]">{value}</span>
  </div>
);

export default App;
