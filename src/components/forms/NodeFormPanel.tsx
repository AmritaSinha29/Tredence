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
      case 'start': return <StartNodeForm data={data} onChange={handleChange} />;
      case 'task': return <TaskNodeForm data={data} onChange={handleChange} />;
      case 'approval': return <ApprovalNodeForm data={data} onChange={handleChange} />;
      case 'automated': return <AutomatedStepNodeForm data={data} onChange={handleChange} />;
      case 'end': return <EndNodeForm data={data} onChange={handleChange} />;
      default: return <p className="text-sm text-white/30">Unknown node type</p>;
    }
  };

  return (
    <div className="w-80 glass-strong flex flex-col shadow-2xl animate-slideIn overflow-hidden border-l border-white/[0.06]">
      {/* Header */}
      <div
        className="px-4 py-3.5 border-b border-white/[0.06] flex items-center justify-between"
        style={{ background: `linear-gradient(135deg, ${visuals.color}10, transparent)` }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: visuals.color + '18', color: visuals.color }}
          >
            {ICONS[data.type]}
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: visuals.color }}>
              {visuals.label} Node
            </div>
            <div className="text-[10px] text-white/25 font-mono">{selectedNode.id.slice(0, 18)}...</div>
          </div>
        </div>
        <button
          onClick={() => selectNode(null)}
          className="p-1.5 rounded-lg hover:bg-white/[0.06] text-white/30 hover:text-white/60 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto p-4">
        {renderForm()}
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-white/[0.06]">
        <p className="text-[10px] text-white/20 text-center">Changes saved automatically</p>
      </div>
    </div>
  );
};
