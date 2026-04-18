import React, { memo } from 'react';
import { type NodeProps } from 'reactflow';
import { Zap } from 'lucide-react';
import { type AutomatedStepNodeData } from '../../types';
import { BaseNode } from './BaseNode';

const AutomatedStepNode: React.FC<NodeProps<AutomatedStepNodeData>> = ({ id, data, selected }) => {
  return (
    <BaseNode
      id={id}
      nodeType="automated"
      selected={selected}
      icon={<Zap size={16} />}
      title={data.title || 'Automated Step'}
      subtitle={data.actionId ? `Action: ${data.actionId}` : undefined}
    />
  );
};

export default memo(AutomatedStepNode);
