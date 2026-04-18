import React, { memo } from 'react';
import { type NodeProps } from 'reactflow';
import { ClipboardList } from 'lucide-react';
import { type TaskNodeData } from '../../types';
import { BaseNode } from './BaseNode';

const TaskNode: React.FC<NodeProps<TaskNodeData>> = ({ id, data, selected }) => {
  return (
    <BaseNode
      id={id}
      nodeType="task"
      selected={selected}
      icon={<ClipboardList size={16} />}
      title={data.title || 'Untitled Task'}
      subtitle={data.assignee ? `Assignee: ${data.assignee}` : undefined}
      hasValidationError={!data.title?.trim()}
    />
  );
};

export default memo(TaskNode);
