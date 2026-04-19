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
  id, nodeType, selected, icon, title, subtitle, children, hasValidationError,
}) => {
  const deleteNode = useWorkflowStore((s) => s.deleteNode);
  const visuals = NODE_VISUALS[nodeType];

  return (
    <div
      role="button"
      aria-label={`${visuals.label} node: ${title || 'Untitled'}`}
      tabIndex={0}
      className={`
        relative group min-w-[210px] max-w-[250px] rounded-xl border-[1.5px]
        transition-all duration-150 ease-out
        ${selected
          ? 'shadow-lg ring-2 ring-offset-2 scale-[1.03]'
          : 'shadow-sm hover:shadow-md hover:-translate-y-0.5'}
      `}
      style={{
        backgroundColor: visuals.bgColor,
        borderColor: selected ? visuals.color : visuals.borderColor,
        // ring color via CSS variable
        ...(selected ? { '--tw-ring-color': visuals.color + '40', '--tw-ring-offset-color': '#f5f6fa' } as React.CSSProperties : {}),
      }}
    >
      {/* Validation badge */}
      {hasValidationError && (
        <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#e04e5e] rounded-full border-2 border-white shadow-sm animate-pulse z-10"
             role="alert" aria-label="Validation error" />
      )}

      {/* Delete */}
      <button
        aria-label="Delete node"
        className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center z-10
                   opacity-0 group-hover:opacity-100 transition-opacity duration-150
                   bg-white text-[#e04e5e] border border-[#f5c4ca] shadow-sm
                   hover:bg-[#fef0f1] focus-visible:opacity-100"
        onClick={(e) => { e.stopPropagation(); deleteNode(id); }}
      >
        <Trash2 size={11} />
      </button>

      {/* Target handle */}
      {nodeType !== 'start' && (
        <Handle type="target" position={Position.Top}
          className="!w-3 !h-3 !border-2 !border-white !rounded-full !shadow-sm"
          style={{ backgroundColor: visuals.color }} />
      )}

      {/* Content */}
      <div className="px-3.5 py-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
               style={{ backgroundColor: visuals.color + '14', color: visuals.color }}>
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-semibold uppercase tracking-[0.1em]"
                 style={{ color: visuals.color }}>
              {visuals.label}
            </div>
            <div className="text-[13px] font-semibold text-[#1e1f2e] truncate">
              {title || 'Untitled'}
            </div>
          </div>
        </div>
        {subtitle && (
          <div className="text-[11px] text-[#8e90a6] mt-1.5 truncate pl-[42px]">{subtitle}</div>
        )}
        {children}
      </div>

      {/* Source handle */}
      {nodeType !== 'end' && (
        <Handle type="source" position={Position.Bottom}
          className="!w-3 !h-3 !border-2 !border-white !rounded-full !shadow-sm"
          style={{ backgroundColor: visuals.color }} />
      )}
    </div>
  );
};
