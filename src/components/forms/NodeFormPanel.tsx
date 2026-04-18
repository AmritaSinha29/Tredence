import React from 'react';
import { X, Play, ClipboardList, UserCheck, Zap, Square } from 'lucide-react';
import { useWorkflowStore } from '../../store/workflowStore';
import { type WorkflowNodeData, NODE_VISUALS } from '../../types';
import { StartNodeForm } from './StartNodeForm';
import { TaskNodeForm } from './TaskNodeForm';
import { ApprovalNodeForm } from './ApprovalNodeForm';
import { AutomatedStepNodeForm } from './AutomatedStepNodeForm';
import { EndNodeForm } from './EndNodeForm';

const ICONS = {
  start: <Play size={18} />,
  task: <ClipboardList size={18} />,
  approval: <UserCheck size={18} />,
  automated: <Zap size={18} />,
  end: <Square size={18} />,
};

export const NodeFormPanel: React.FC = () => {
  const selectedNodeId = useWorkflowStore((s) => s.selectedNodeId);
  const nodes = useWorkflowStore((s) => s.nodes);
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);
  const selectNode = useWorkflowStore((s) => s.selectNode);
  const pushSnapshot = useWorkflowStore((s) => s.pushSnapshot);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  if (!selectedNode) return null;

  const data = selectedNode.data;
  const visuals = NODE_VISUALS[data.type];

  const handleChange = (partial: Partial<WorkflowNodeData>) => {
    pushSnapshot();
    updateNodeData(selectedNode.id, partial);
  };

  const renderForm = () => {
    switch (data.type) {
      case 'start':
        return <StartNodeForm data={data} onChange={handleChange} />;
      case 'task':
        return <TaskNodeForm data={data} onChange={handleChange} />;
      case 'approval':
        return <ApprovalNodeForm data={data} onChange={handleChange} />;
      case 'automated':
        return <AutomatedStepNodeForm data={data} onChange={handleChange} />;
      case 'end':
        return <EndNodeForm data={data} onChange={handleChange} />;
      default:
        return <p className="text-sm text-slate-400">Unknown node type</p>;
    }
  };

  return (
    <div
      className="w-80 bg-white/90 backdrop-blur-xl border-l border-slate-200 flex flex-col 
                 shadow-[-4px_0_24px_rgba(0,0,0,0.05)] animate-slideIn overflow-hidden"
    >
      {/* Header */}
      <div
        className="px-4 py-3 border-b flex items-center justify-between"
        style={{ borderColor: visuals.borderColor, backgroundColor: visuals.bgColor + '80' }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: visuals.color + '20', color: visuals.color }}
          >
            {ICONS[data.type]}
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: visuals.color }}>
              {visuals.label} Node
            </div>
            <div className="text-xs text-slate-400 font-mono">{selectedNode.id.slice(0, 16)}...</div>
          </div>
        </div>
        <button
          onClick={() => selectNode(null)}
          className="p-1.5 rounded-md hover:bg-white/60 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {renderForm()}
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/50">
        <p className="text-[10px] text-slate-400 text-center">
          Changes are saved automatically
        </p>
      </div>
    </div>
  );
};
