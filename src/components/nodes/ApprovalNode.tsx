import React, { memo } from 'react';
import { type NodeProps } from 'reactflow';
import { UserCheck } from 'lucide-react';
import { type ApprovalNodeData } from '../../types';
import { BaseNode } from './BaseNode';

const ApprovalNode: React.FC<NodeProps<ApprovalNodeData>> = ({ id, data, selected }) => {
  return (
    <BaseNode
      id={id}
      nodeType="approval"
      selected={selected}
      icon={<UserCheck size={16} />}
      title={data.title || 'Approval Step'}
      subtitle={data.approverRole ? `Role: ${data.approverRole}` : undefined}
    />
  );
};

export default memo(ApprovalNode);
