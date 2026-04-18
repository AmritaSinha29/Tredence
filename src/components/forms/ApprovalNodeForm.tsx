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
        <input
          type="text"
          value={data.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="e.g., Manager Approval"
          className={inputClassName}
        />
      </FormField>

      <FormField label="Approver Role">
        <select
          value={isCustomRole && data.approverRole ? 'Custom' : data.approverRole}
          onChange={(e) => {
            if (e.target.value === 'Custom') {
              onChange({ approverRole: '' });
            } else {
              onChange({ approverRole: e.target.value });
            }
          }}
          className={selectClassName}
        >
          {APPROVER_ROLES.map((role) => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
        {(isCustomRole || data.approverRole === '') && (
          <input
            type="text"
            value={data.approverRole}
            onChange={(e) => onChange({ approverRole: e.target.value })}
            placeholder="Enter custom role..."
            className={`${inputClassName} mt-2`}
          />
        )}
      </FormField>

      <FormField label="Auto-approve Threshold (days)">
        <input
          type="number"
          value={data.autoApproveThreshold}
          onChange={(e) => onChange({ autoApproveThreshold: Number(e.target.value) })}
          min={0}
          placeholder="0 = no auto-approve"
          className={inputClassName}
        />
        <p className="text-xs text-slate-400 mt-1">
          Set to 0 to disable auto-approval. Otherwise, the request auto-approves after this many days.
        </p>
      </FormField>
    </div>
  );
};
