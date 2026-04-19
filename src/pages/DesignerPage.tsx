import React, { useState, useRef } from 'react';
import {
  Undo2, Redo2, Download, Upload, FlaskConical, LayoutGrid,
  Trash2, Save, CheckCircle,
} from 'lucide-react';
import { ReactFlowProvider } from 'reactflow';
import { WorkflowCanvas } from '../components/canvas/WorkflowCanvas';
import { NodePalette } from '../components/sidebar/NodePalette';
import { NodeFormPanel } from '../components/forms/NodeFormPanel';
import { SandboxPanel } from '../components/sandbox/SandboxPanel';
import { useWorkflowStore } from '../store/workflowStore';
import { useCatalogStore } from '../store/catalogStore';
import { useUndoRedo } from '../hooks/useUndoRedo';
import { useAutoLayout } from '../hooks/useAutoLayout';
import { exportWorkflowToFile, importWorkflowFromFile } from '../utils/serializer';

export const DesignerPage: React.FC = () => {
  const [sandboxOpen, setSandboxOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const selectedNodeId = useWorkflowStore((s) => s.selectedNodeId);
  const serialize = useWorkflowStore((s) => s.serialize);
  const importWorkflow = useWorkflowStore((s) => s.importWorkflow);
  const clearWorkflow = useWorkflowStore((s) => s.clearWorkflow);
  const pushSnapshot = useWorkflowStore((s) => s.pushSnapshot);
  
  const addWorkflow = useCatalogStore((s) => s.addWorkflow);
  const [savedStatus, setSavedStatus] = useState(false);

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

  const handleSave = () => {
    const startNode = nodes.find(n => n.type === 'start');
    const name = (startNode?.data as { title?: string })?.title || 'Custom Workflow';
    
    addWorkflow({
      name,
      template: 'onboarding', // using default layout
      nodes: nodes.length,
      edges: edges.length,
      status: 'draft' // saved as draft by default
    });
    
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 2000);
  };

  return (
    <ReactFlowProvider>
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Designer Toolbar */}
        <div className="h-10 bg-white border-b border-[#e2e4ef] flex items-center justify-between px-3 flex-shrink-0">
          <nav className="flex items-center gap-0.5" role="toolbar" aria-label="Designer actions">
            <TBtn icon={<Undo2 size={14} />} label="Undo" onClick={undo} disabled={!canUndo} />
            <TBtn icon={<Redo2 size={14} />} label="Redo" onClick={redo} disabled={!canRedo} />
            <Sep />
            <TBtn icon={<LayoutGrid size={14} />} label="Auto Layout" onClick={handleAutoLayout} />
            <Sep />
            <TBtn icon={<Download size={14} />} label="Export JSON" onClick={handleExport} />
            <TBtn icon={<Upload size={14} />} label="Import JSON" onClick={() => fileInputRef.current?.click()} />
            <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
            <Sep />
            <TBtn icon={<Trash2 size={14} />} label="Clear" onClick={clearWorkflow} danger />
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={handleSave} disabled={savedStatus}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors shadow-sm border ${
                savedStatus
                  ? 'bg-[#e7f8f0] text-[#22a86b] border-[#c5e8d8]'
                  : 'bg-white text-[#1e1f2e] border-[#e2e4ef] hover:bg-[#f8f9fc]'
              }`}>
              {savedStatus ? <CheckCircle size={13} /> : <Save size={13} />}
              {savedStatus ? 'Saved!' : 'Save Draft'}
            </button>
            <button onClick={() => setSandboxOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0F3D4C] hover:bg-[#0A2B36] text-white
                         rounded-md text-xs font-semibold transition-colors shadow-sm">
              <FlaskConical size={13} /> Test Workflow
            </button>
          </div>
        </div>

        {/* Designer Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <aside className="w-52 bg-white border-r border-[#e2e4ef] flex flex-col flex-shrink-0">
            <div className="flex-1 overflow-y-auto p-3.5">
              <NodePalette />
              <div className="mt-5 pt-4 border-t border-[#e2e4ef]">
                <h3 className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8e90a6] mb-2">Statistics</h3>
                <div className="space-y-1">
                  <StatRow label="Nodes" value={nodes.length} />
                  <StatRow label="Connections" value={edges.length} />
                </div>
              </div>
              <div className="mt-5 pt-4 border-t border-[#e2e4ef]">
                <h3 className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8e90a6] mb-2">Tips</h3>
                <ul className="space-y-0.5 text-[10px] text-[#8e90a6] list-none">
                  <li>• Drag nodes onto canvas</li>
                  <li>• Drag handles to connect</li>
                  <li>• Click a node to configure</li>
                  <li>• Backspace to delete</li>
                  <li>• Ctrl+Z / Ctrl+Y</li>
                </ul>
              </div>
            </div>
          </aside>

          {/* Canvas */}
          <WorkflowCanvas />

          {/* Form Panel */}
          {selectedNodeId && <NodeFormPanel />}
        </div>

        <SandboxPanel isOpen={sandboxOpen} onClose={() => setSandboxOpen(false)} />
      </div>
    </ReactFlowProvider>
  );
};

/* ─── Helpers ──────────────────────────────────────────── */
const TBtn: React.FC<{
  icon: React.ReactNode; label: string; onClick: () => void;
  disabled?: boolean; danger?: boolean;
}> = ({ icon, label, onClick, disabled, danger }) => (
  <button onClick={onClick} disabled={disabled} title={label} aria-label={label}
    className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium transition-colors
      disabled:opacity-25 disabled:cursor-not-allowed
      ${danger ? 'text-[#e04e5e] hover:bg-[#fef0f1]' : 'text-[#5a5c78] hover:bg-[#f0f1f8] hover:text-[#1e1f2e]'}`}>
    {icon}
    <span className="hidden xl:inline">{label}</span>
  </button>
);

const Sep = () => <div className="w-px h-4 bg-[#e2e4ef] mx-1" />;

const StatRow: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="flex items-center justify-between px-2.5 py-1.5 rounded-md bg-[#f8f9fc]">
    <span className="text-[10px] text-[#8e90a6]">{label}</span>
    <span className="text-xs font-semibold text-[#1e1f2e]">{value}</span>
  </div>
);
