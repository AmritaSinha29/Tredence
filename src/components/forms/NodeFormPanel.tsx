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
  start: <Play size={18} />, task: <ClipboardList size={18} />,
  approval: <UserCheck size={18} />, automated: <Zap size={18} />, end: <Square size={18} />,
};

export const NodeFormPanel: React.FC = () => {
  const selectedNodeId = useWorkflowStore((s) => s.selectedNodeId);
  const nodes = useWorkflowStore((s) => s.nodes);
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);
  const selectNode = useWorkflowStore((s) => s.selectNode);
  const pushSnapshot = useWorkflowStore((s) => s.pushSnapshot);

  const node = nodes.find((n) => n.id === selectedNodeId);
  if (!node) return null;

  const data = node.data;
  const v = NODE_VISUALS[data.type];

  const handleChange = (partial: Partial<WorkflowNodeData>) => {
    pushSnapshot();
    updateNodeData(node.id, partial);
  };

  const renderForm = () => {
    switch (data.type) {
      case 'start': return <StartNodeForm data={data} onChange={handleChange} />;
      case 'task': return <TaskNodeForm data={data} onChange={handleChange} />;
      case 'approval': return <ApprovalNodeForm data={data} onChange={handleChange} />;
      case 'automated': return <AutomatedStepNodeForm data={data} onChange={handleChange} />;
      case 'end': return <EndNodeForm data={data} onChange={handleChange} />;
    }
  };

  return (
    <aside className="w-80 bg-white border-l border-[#e2e4ef] flex flex-col shadow-sm animate-slideIn"
           role="complementary" aria-label="Node configuration">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#e2e4ef] flex items-center justify-between bg-[#f8f9fc]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-md flex items-center justify-center"
               style={{ backgroundColor: v.color + '14', color: v.color }}>
            {ICONS[data.type]}
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: v.color }}>
              {v.label} Node
            </div>
            <div className="text-[10px] text-[#b4b6c8] font-mono">{node.id.slice(0, 20)}...</div>
          </div>
        </div>
        <button onClick={() => selectNode(null)} aria-label="Close panel"
          className="p-1.5 rounded-md hover:bg-[#f0f1f8] text-[#8e90a6] hover:text-[#5a5c78] transition-colors">
          <X size={16} />
        </button>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto p-4">{renderForm()}</div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-[#e2e4ef] bg-[#f8f9fc]">
        <p className="text-[10px] text-[#b4b6c8] text-center">Changes are saved automatically</p>
      </div>
    </aside>
  );
};
