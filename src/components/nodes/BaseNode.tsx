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
        relative group min-w-[200px] max-w-[240px] rounded-xl border-2 shadow-lg
        transition-all duration-200 ease-out
        ${selected ? 'ring-2 ring-offset-2 ring-offset-slate-50 scale-105' : 'hover:shadow-xl hover:-translate-y-0.5'}
      `}
      style={{
        backgroundColor: visuals.bgColor,
        borderColor: selected ? visuals.color : visuals.borderColor,
      } as React.CSSProperties}
    >
      {/* Validation error indicator */}
      {hasValidationError && (
        <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse z-10" />
      )}

      {/* Delete button */}
      <button
        className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 hover:bg-red-200 text-red-500 rounded-full 
                   opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center justify-center z-10
                   border border-red-200"
        onClick={(e) => {
          e.stopPropagation();
          deleteNode(id);
        }}
        title="Delete node"
      >
        <Trash2 size={12} />
      </button>

      {/* Target handle (top) — not for Start nodes */}
      {nodeType !== 'start' && (
        <Handle
          type="target"
          position={Position.Top}
          className="!w-3 !h-3 !border-2 !border-white !rounded-full"
          style={{ backgroundColor: visuals.color }}
        />
      )}

      {/* Node content */}
      <div className="px-3 py-2.5">
        <div className="flex items-center gap-2 mb-1">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: visuals.color + '20', color: visuals.color }}
          >
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-semibold uppercase tracking-wider opacity-60" style={{ color: visuals.color }}>
              {visuals.label}
            </div>
            <div className="text-sm font-medium text-slate-800 truncate">{title || 'Untitled'}</div>
          </div>
        </div>
        {subtitle && (
          <div className="text-xs text-slate-500 mt-1 truncate">{subtitle}</div>
        )}
        {children}
      </div>

      {/* Source handle (bottom) — not for End nodes */}
      {nodeType !== 'end' && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="!w-3 !h-3 !border-2 !border-white !rounded-full"
          style={{ backgroundColor: visuals.color }}
        />
      )}
    </div>
  );
};
