import React, { memo } from 'react';
import { type NodeProps } from 'reactflow';
import { Play } from 'lucide-react';
import { type StartNodeData } from '../../types';
import { BaseNode } from './BaseNode';

const StartNode: React.FC<NodeProps<StartNodeData>> = ({ id, data, selected }) => {
  const metaCount = Object.keys(data.metadata || {}).length;

  return (
    <BaseNode
      id={id}
      nodeType="start"
      selected={selected}
      icon={<Play size={16} />}
      title={data.title || 'Workflow Start'}
      subtitle={metaCount > 0 ? `${metaCount} metadata field${metaCount > 1 ? 's' : ''}` : undefined}
    />
  );
};

export default memo(StartNode);
