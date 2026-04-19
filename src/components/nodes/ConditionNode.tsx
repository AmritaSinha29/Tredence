import React, { memo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { Trash2, Split } from 'lucide-react';
import { NODE_VISUALS, type ConditionNodeData } from '../../types';
import { useWorkflowStore } from '../../store/workflowStore';

const ConditionNode: React.FC<NodeProps<ConditionNodeData>> = ({
  id, data, selected,
}) => {
  const deleteNode = useWorkflowStore((s) => s.deleteNode);
  const visuals = NODE_VISUALS['condition'];
  const hasValidationError = !data.variable || !data.value;

  return (
    <div
      role="button"
      aria-label={`${visuals.label} node: ${data.title || 'Untitled'}`}
      tabIndex={0}
      className={`
        relative group min-w-[210px] max-w-[250px] rounded-md border-[1.5px]
        transition-all duration-150 ease-out
        ${selected
          ? 'shadow-lg ring-2 ring-offset-2 scale-[1.03]'
          : 'shadow-sm hover:shadow-md hover:-translate-y-0.5'}
      `}
      style={{
        backgroundColor: visuals.bgColor,
        borderColor: selected ? visuals.color : visuals.borderColor,
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

      {/* Target handle (Input) */}
      <Handle type="target" position={Position.Top}
        className="!w-3 !h-3 !border-2 !border-white !rounded-full !shadow-sm"
        style={{ backgroundColor: visuals.color }} />

      {/* Content */}
      <div className="px-3.5 py-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0"
               style={{ backgroundColor: visuals.color + '14', color: visuals.color }}>
            <Split size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-semibold uppercase tracking-[0.1em]"
                 style={{ color: visuals.color }}>
              {visuals.label}
            </div>
            <div className="text-[13px] font-semibold text-[#1e1f2e] truncate">
              {data.title || 'Untitled Condition'}
            </div>
          </div>
        </div>
        <div className="text-[11px] text-[#8e90a6] mt-1.5 truncate pl-[42px]">
          If {data.variable || 'X'} {data.operator === 'equals' ? '==' : data.operator === 'greater_than' ? '>' : data.operator === 'less_than' ? '<' : data.operator} {data.value || 'Y'}
        </div>
      </div>

      {/* Source handles (Outputs) */}
      <Handle type="source" position={Position.Bottom} id="true"
        className="!w-3 !h-3 !border-2 !border-white !rounded-full !shadow-sm"
        style={{ left: '30%', backgroundColor: '#22a86b' }} />
      <Handle type="source" position={Position.Bottom} id="false"
        className="!w-3 !h-3 !border-2 !border-white !rounded-full !shadow-sm"
        style={{ left: '70%', backgroundColor: '#e04e5e' }} />

      {/* Labels for handles */}
      <div className="absolute -bottom-5 left-0 w-full flex justify-between px-6">
        <span className="text-[9px] font-bold text-[#22a86b]">TRUE</span>
        <span className="text-[9px] font-bold text-[#e04e5e]">FALSE</span>
      </div>
    </div>
  );
};

export default memo(ConditionNode);
