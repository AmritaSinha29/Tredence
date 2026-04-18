import React, { memo } from 'react';
import { type NodeProps } from 'reactflow';
import { Square } from 'lucide-react';
import { type EndNodeData } from '../../types';
import { BaseNode } from './BaseNode';

const EndNode: React.FC<NodeProps<EndNodeData>> = ({ id, data, selected }) => {
  return (
    <BaseNode
      id={id}
      nodeType="end"
      selected={selected}
      icon={<Square size={16} />}
      title={data.endMessage || 'Workflow End'}
      subtitle={data.showSummary ? 'Summary enabled' : undefined}
    />
  );
};

export default memo(EndNode);
