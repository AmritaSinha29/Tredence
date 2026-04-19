import React from 'react';
import { Play, ClipboardList, UserCheck, Zap, Square, GripVertical } from 'lucide-react';
import { type WorkflowNodeType, NODE_VISUALS } from '../../types';

interface PaletteItem {
  type: WorkflowNodeType;
  icon: React.ReactNode;
  desc: string;
}

const ITEMS: PaletteItem[] = [
  { type: 'start', icon: <Play size={15} />, desc: 'Entry point' },
  { type: 'task', icon: <ClipboardList size={15} />, desc: 'Human task' },
  { type: 'approval', icon: <UserCheck size={15} />, desc: 'Approval gate' },
  { type: 'automated', icon: <Zap size={15} />, desc: 'System action' },
  { type: 'end', icon: <Square size={15} />, desc: 'Completion' },
];

export const NodePalette: React.FC = () => {
  const onDragStart = (e: React.DragEvent, type: WorkflowNodeType) => {
    e.dataTransfer.setData('application/reactflow', type);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div>
      <h3 className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8e90a6] mb-3">
        Node Types
      </h3>
      <div className="space-y-1.5" role="list" aria-label="Draggable node types">
        {ITEMS.map((item) => {
          const v = NODE_VISUALS[item.type];
          return (
            <div
              key={item.type}
              role="listitem"
              draggable
              onDragStart={(e) => onDragStart(e, item.type)}
              className="flex items-center gap-2 px-2.5 py-2 rounded-lg border cursor-grab
                         active:cursor-grabbing transition-all duration-150
                         hover:shadow-sm hover:border-[#d0d3e4] active:scale-[0.97]"
              style={{
                backgroundColor: v.bgColor,
                borderColor: v.borderColor,
              }}
              aria-label={`Drag to add ${v.label} node`}
            >
              <GripVertical size={12} className="text-[#b4b6c8] flex-shrink-0" />
              <div className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
                   style={{ backgroundColor: v.color + '14', color: v.color }}>
                {item.icon}
              </div>
              <div className="min-w-0">
                <div className="text-[12px] font-semibold text-[#1e1f2e]">{v.label}</div>
                <div className="text-[10px] text-[#8e90a6] leading-tight">{item.desc}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
