import React, { useState, useRef } from 'react';
import {
  Undo2,
  Redo2,
  Download,
  Upload,
  FlaskConical,
  LayoutGrid,
  FileJson,
  Trash2,
  Workflow,
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

  const handleExport = () => {
    const workflow = serialize('My Workflow');
    exportWorkflowToFile(workflow);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const workflow = await importWorkflowFromFile(file);
    if (workflow) {
      importWorkflow(workflow);
    } else {
      alert('Invalid workflow file');
    }
    e.target.value = '';
  };

  const handleAutoLayout = () => {
    pushSnapshot();
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges);
    importWorkflow({
      version: '1.0.0',
      name: '',
      nodes: layoutedNodes,
      edges: layoutedEdges,
      createdAt: '',
      updatedAt: '',
    });
  };

  return (
    <ReactFlowProvider>
      <div className="h-screen w-screen flex flex-col bg-slate-50 overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-14 bg-white/80 backdrop-blur-xl border-b border-slate-200 flex items-center justify-between px-5 flex-shrink-0 z-20">
          {/* Left: Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center shadow-md">
              <Workflow size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-800 leading-tight">HR Workflow Designer</h1>
              <p className="text-[10px] text-slate-400">Visual Process Builder</p>
            </div>
          </div>

          {/* Center: Actions */}
          <div className="flex items-center gap-1">
            {/* Undo/Redo */}
            <ToolbarButton icon={<Undo2 size={16} />} label="Undo" onClick={undo} disabled={!canUndo} />
            <ToolbarButton icon={<Redo2 size={16} />} label="Redo" onClick={redo} disabled={!canRedo} />

            <div className="w-px h-6 bg-slate-200 mx-1" />

            {/* Auto-layout */}
            <ToolbarButton icon={<LayoutGrid size={16} />} label="Auto Layout" onClick={handleAutoLayout} />

            <div className="w-px h-6 bg-slate-200 mx-1" />

            {/* Export/Import */}
            <ToolbarButton icon={<Download size={16} />} label="Export JSON" onClick={handleExport} />
            <ToolbarButton icon={<Upload size={16} />} label="Import JSON" onClick={() => fileInputRef.current?.click()} />
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />

            <div className="w-px h-6 bg-slate-200 mx-1" />

            {/* Templates */}
            <ToolbarButton
              icon={<FileJson size={16} />}
              label="Onboarding"
              onClick={() => loadTemplate('onboarding')}
              accent
            />
            <ToolbarButton
              icon={<FileJson size={16} />}
              label="Leave Approval"
              onClick={() => loadTemplate('leave-approval')}
              accent
            />

            <div className="w-px h-6 bg-slate-200 mx-1" />

            <ToolbarButton
              icon={<Trash2 size={16} />}
              label="Clear"
              onClick={clearWorkflow}
              danger
            />
          </div>

          {/* Right: Sandbox */}
          <button
            onClick={() => setSandboxOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-indigo-500 
                       text-white rounded-xl hover:from-violet-600 hover:to-indigo-600 
                       transition-all duration-200 shadow-md hover:shadow-lg text-sm font-semibold"
          >
            <FlaskConical size={16} />
            Test Workflow
          </button>
        </header>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar */}
          <aside className="w-56 bg-white/60 backdrop-blur-xl border-r border-slate-200 p-4 overflow-y-auto flex-shrink-0">
            <NodePalette />

            {/* Stats */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1 mb-2">
                Stats
              </h3>
              <div className="space-y-1.5">
                <StatRow label="Nodes" value={nodes.length} />
                <StatRow label="Edges" value={edges.length} />
              </div>
            </div>

            {/* Instructions */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1 mb-2">
                Quick Tips
              </h3>
              <div className="space-y-1 text-[10px] text-slate-400">
                <p>• Drag nodes onto the canvas</p>
                <p>• Connect nodes by dragging handles</p>
                <p>• Click a node to edit it</p>
                <p>• Delete with Backspace/Delete</p>
                <p>• Ctrl+Z to undo</p>
              </div>
            </div>
          </aside>

          {/* Canvas */}
          <WorkflowCanvas />

          {/* Right Panel — Node Editor */}
          {selectedNodeId && <NodeFormPanel />}
        </div>

        {/* Sandbox Modal */}
        <SandboxPanel isOpen={sandboxOpen} onClose={() => setSandboxOpen(false)} />
      </div>
    </ReactFlowProvider>
  );
};

// ─── Toolbar Button Component ─────────────────────────────
interface ToolbarButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  accent?: boolean;
  danger?: boolean;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({ icon, label, onClick, disabled, accent, danger }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={label}
    className={`
      flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150
      disabled:opacity-30 disabled:cursor-not-allowed
      ${danger
        ? 'text-red-500 hover:bg-red-50 hover:text-red-600'
        : accent
          ? 'text-violet-600 hover:bg-violet-50'
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
      }
    `}
  >
    {icon}
    <span className="hidden xl:inline">{label}</span>
  </button>
);

// ─── Stat Row ─────────────────────────────────────────────
const StatRow: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="flex items-center justify-between px-2 py-1 rounded-md bg-slate-50">
    <span className="text-[10px] text-slate-500">{label}</span>
    <span className="text-xs font-bold text-slate-700">{value}</span>
  </div>
);

export default App;
