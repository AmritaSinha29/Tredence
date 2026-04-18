import React from 'react';
import { Play, ClipboardList, UserCheck, Zap, Square } from 'lucide-react';
import { type WorkflowNodeType, NODE_VISUALS } from '../../types';

interface NodePaletteItem {
  type: WorkflowNodeType;
  icon: React.ReactNode;
  description: string;
}

const PALETTE_ITEMS: NodePaletteItem[] = [
  { type: 'start', icon: <Play size={18} />, description: 'Workflow entry point' },
  { type: 'task', icon: <ClipboardList size={18} />, description: 'Human task step' },
  { type: 'approval', icon: <UserCheck size={18} />, description: 'Manager approval' },
  { type: 'automated', icon: <Zap size={18} />, description: 'System automation' },
  { type: 'end', icon: <Square size={18} />, description: 'Workflow completion' },
];

export const NodePalette: React.FC = () => {
  const onDragStart = (event: React.DragEvent, nodeType: WorkflowNodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="space-y-2">
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1 mb-3">
        Node Types
      </h3>
      {PALETTE_ITEMS.map((item) => {
        const visuals = NODE_VISUALS[item.type];
        return (
          <div
            key={item.type}
            draggable
            onDragStart={(e) => onDragStart(e, item.type)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border-2 cursor-grab 
                       active:cursor-grabbing transition-all duration-200
                       hover:shadow-md hover:-translate-y-0.5 active:scale-95"
            style={{
              backgroundColor: visuals.bgColor,
              borderColor: visuals.borderColor,
            }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: visuals.color + '20', color: visuals.color }}
            >
              {item.icon}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-slate-700">{visuals.label}</div>
              <div className="text-[10px] text-slate-400">{item.description}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
