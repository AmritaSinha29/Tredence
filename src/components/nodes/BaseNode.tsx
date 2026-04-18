import React, { type ReactNode } from 'react';
import { Handle, Position } from 'reactflow';
import { Trash2 } from 'lucide-react';
import { type WorkflowNodeType, NODE_VISUALS } from '../../types';
import { useWorkflowStore } from '../../store/workflowStore';

interface BaseNodeProps {
  id: string;
  nodeType: WorkflowNodeType;
  selected?: boolean;
  icon: ReactNode;
  title: string;
  subtitle?: string;
  children?: ReactNode;
  hasValidationError?: boolean;
}

export const BaseNode: React.FC<BaseNodeProps> = ({
  id,
  nodeType,
  selected,
  icon,
  title,
  subtitle,
  children,
  hasValidationError,
}) => {
  const deleteNode = useWorkflowStore((s) => s.deleteNode);
  const visuals = NODE_VISUALS[nodeType];

  return (
    <div
      className={`
        relative group min-w-[200px] max-w-[240px] rounded-xl border shadow-xl
        transition-all duration-200 ease-out backdrop-blur-xl
        ${selected
          ? 'scale-105 shadow-2xl'
          : 'hover:shadow-2xl hover:-translate-y-0.5'
        }
      `}
      style={{
        backgroundColor: selected
          ? visuals.bgColor.replace('0.08', '0.14')
          : visuals.bgColor,
        borderColor: selected ? visuals.color : visuals.borderColor,
        boxShadow: selected
          ? `0 0 30px ${visuals.color}20, 0 8px 32px rgba(0,0,0,0.4)`
          : '0 4px 24px rgba(0,0,0,0.3)',
      }}
    >
      {/* Validation error indicator */}
      {hasValidationError && (
        <div
          className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full border-2 animate-pulse z-10"
          style={{ backgroundColor: '#ef4444', borderColor: '#0c0a1d' }}
        />
      )}

      {/* Delete button */}
      <button
        className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full flex items-center justify-center z-10
                   opacity-0 group-hover:opacity-100 transition-all duration-150
                   bg-red-500/80 hover:bg-red-500 text-white backdrop-blur-sm
                   border border-red-400/30 shadow-lg"
        onClick={(e) => {
          e.stopPropagation();
          deleteNode(id);
        }}
        title="Delete node"
      >
        <Trash2 size={11} />
      </button>

      {/* Target handle (top) — not for Start nodes */}
      {nodeType !== 'start' && (
        <Handle
          type="target"
          position={Position.Top}
          className="!w-3 !h-3 !border-2 !rounded-full"
          style={{
            backgroundColor: visuals.color,
            borderColor: '#0c0a1d',
          }}
        />
      )}

      {/* Node content */}
      <div className="px-3.5 py-3">
        <div className="flex items-center gap-2.5 mb-1">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: visuals.color + '18', color: visuals.color }}
          >
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <div
              className="text-[10px] font-bold uppercase tracking-[0.12em]"
              style={{ color: visuals.color, opacity: 0.8 }}
            >
              {visuals.label}
            </div>
            <div className="text-[13px] font-semibold text-white/90 truncate">
              {title || 'Untitled'}
            </div>
          </div>
        </div>
        {subtitle && (
          <div className="text-[11px] text-white/40 mt-1 truncate pl-[42px]">
            {subtitle}
          </div>
        )}
        {children}
      </div>

      {/* Source handle (bottom) — not for End nodes */}
      {nodeType !== 'end' && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="!w-3 !h-3 !border-2 !rounded-full"
          style={{
            backgroundColor: visuals.color,
            borderColor: '#0c0a1d',
          }}
        />
      )}
    </div>
  );
};
