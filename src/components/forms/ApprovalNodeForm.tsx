import React from 'react';
import { type ApprovalNodeData } from '../../types';
import { FormField, inputClassName, selectClassName } from './shared/FormField';

interface ApprovalNodeFormProps {
  data: ApprovalNodeData;
  onChange: (data: Partial<ApprovalNodeData>) => void;
}

const APPROVER_ROLES = ['Manager', 'HRBP', 'Director', 'VP', 'CFO', 'CEO', 'Custom'];

export const ApprovalNodeForm: React.FC<ApprovalNodeFormProps> = ({ data, onChange }) => {
  const isCustomRole = !APPROVER_ROLES.slice(0, -1).includes(data.approverRole);

  return (
    <div>
      <FormField label="Title">
        <input type="text" value={data.title} onChange={(e) => onChange({ title: e.target.value })}
          placeholder="e.g., Manager Approval" className={inputClassName} />
      </FormField>

      <FormField label="Approver Role">
        <select value={isCustomRole && data.approverRole ? 'Custom' : data.approverRole}
          onChange={(e) => onChange({ approverRole: e.target.value === 'Custom' ? '' : e.target.value })}
          className={selectClassName}>
          {APPROVER_ROLES.map((role) => (<option key={role} value={role}>{role}</option>))}
        </select>
        {(isCustomRole || data.approverRole === '') && (
          <input type="text" value={data.approverRole} onChange={(e) => onChange({ approverRole: e.target.value })}
            placeholder="Enter custom role..." className={`${inputClassName} mt-2`} />
        )}
      </FormField>

      <FormField label="Auto-approve Threshold (days)">
        <input type="number" value={data.autoApproveThreshold} min={0}
          onChange={(e) => onChange({ autoApproveThreshold: Number(e.target.value) })}
          placeholder="0 = no auto-approve" className={inputClassName} />
        <p className="text-[10px] text-white/25 mt-1">Set to 0 to disable. Otherwise, auto-approves after N days.</p>
      </FormField>
    </div>
  );
};
