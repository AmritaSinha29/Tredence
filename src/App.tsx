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
    const workflow = await importWorkflowFromFile(file);
    if (workflow) importWorkflow(workflow);
    else alert('Invalid workflow file');
    e.target.value = '';
  };

  const handleAutoLayout = () => {
    pushSnapshot();
    const { nodes: ln, edges: le } = getLayoutedElements(nodes, edges);
    importWorkflow({ version: '1.0.0', name: '', nodes: ln, edges: le, createdAt: '', updatedAt: '' });
  };

  return (
    <ReactFlowProvider>
      <div className="h-screen w-screen flex flex-col bg-app overflow-hidden">
        {/* ─── Header ──────────────────────────────────────── */}
        <header className="h-14 glass border-b border-white/[0.06] flex items-center justify-between px-5 flex-shrink-0 z-20 relative">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg"
                 style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1, #ec4899)' }}>
              <Workflow size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white/90 leading-tight">HR Workflow Designer</h1>
              <p className="text-[10px] text-white/30">Visual Process Builder</p>
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex items-center gap-0.5">
            <ToolbarBtn icon={<Undo2 size={15} />} label="Undo" onClick={undo} disabled={!canUndo} />
            <ToolbarBtn icon={<Redo2 size={15} />} label="Redo" onClick={redo} disabled={!canRedo} />
            <Divider />
            <ToolbarBtn icon={<LayoutGrid size={15} />} label="Auto Layout" onClick={handleAutoLayout} />
            <Divider />
            <ToolbarBtn icon={<Download size={15} />} label="Export" onClick={handleExport} />
            <ToolbarBtn icon={<Upload size={15} />} label="Import" onClick={() => fileInputRef.current?.click()} />
            <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
            <Divider />
            <ToolbarBtn icon={<FileJson size={15} />} label="Onboarding" onClick={() => loadTemplate('onboarding')} accent />
            <ToolbarBtn icon={<FileJson size={15} />} label="Leave" onClick={() => loadTemplate('leave-approval')} accent />
            <Divider />
            <ToolbarBtn icon={<Trash2 size={15} />} label="Clear" onClick={clearWorkflow} danger />
          </div>

          {/* Test Button */}
          <button onClick={() => setSandboxOpen(true)}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white
                       transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02]"
            style={{
              background: 'linear-gradient(135deg, #8b5cf6, #6366f1, #ec4899)',
              boxShadow: '0 4px 20px rgba(139, 92, 246, 0.3)',
            }}>
            <FlaskConical size={16} />
            Test Workflow
          </button>
        </header>

        {/* ─── Main Layout ─────────────────────────────────── */}
        <div className="flex flex-1 overflow-hidden relative">
          {/* Sidebar */}
          <aside className="w-52 glass border-r border-white/[0.06] p-4 overflow-y-auto flex-shrink-0 relative z-10">
            <NodePalette />

            <div className="mt-6 pt-4 border-t border-white/[0.06]">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/30 px-1 mb-2">Stats</h3>
              <div className="space-y-1.5">
                <StatRow label="Nodes" value={nodes.length} />
                <StatRow label="Edges" value={edges.length} />
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/[0.06]">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/30 px-1 mb-2">Tips</h3>
              <div className="space-y-1 text-[10px] text-white/20">
                <p>• Drag nodes onto canvas</p>
                <p>• Drag handles to connect</p>
                <p>• Click node to configure</p>
                <p>• Backspace to delete</p>
                <p>• Ctrl+Z / Ctrl+Y</p>
              </div>
            </div>
          </aside>

          {/* Canvas */}
          <WorkflowCanvas />

          {/* Form Panel */}
          {selectedNodeId && <NodeFormPanel />}
        </div>

        {/* Sandbox */}
        <SandboxPanel isOpen={sandboxOpen} onClose={() => setSandboxOpen(false)} />
      </div>
    </ReactFlowProvider>
  );
};

/* ─── Sub-components ───────────────────────────────────── */
const ToolbarBtn: React.FC<{
  icon: React.ReactNode; label: string; onClick: () => void;
  disabled?: boolean; accent?: boolean; danger?: boolean;
}> = ({ icon, label, onClick, disabled, accent, danger }) => (
  <button onClick={onClick} disabled={disabled} title={label}
    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150
      disabled:opacity-20 disabled:cursor-not-allowed
      ${danger ? 'text-red-400/70 hover:bg-red-500/10 hover:text-red-400'
        : accent ? 'text-purple-400/70 hover:bg-purple-500/10 hover:text-purple-400'
          : 'text-white/40 hover:bg-white/[0.06] hover:text-white/70'}`}>
    {icon}
    <span className="hidden xl:inline">{label}</span>
  </button>
);

const Divider = () => <div className="w-px h-5 bg-white/[0.06] mx-1" />;

const StatRow: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white/[0.03]">
    <span className="text-[10px] text-white/30">{label}</span>
    <span className="text-xs font-bold text-white/60">{value}</span>
  </div>
);

export default App;
