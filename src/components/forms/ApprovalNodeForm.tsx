import React from 'react';
import { type ApprovalNodeData } from '../../types';
import { FormField, inputClassName, selectClassName } from './shared/FormField';

interface Props { data: ApprovalNodeData; onChange: (d: Partial<ApprovalNodeData>) => void; }

const ROLES = ['Manager', 'HRBP', 'Director', 'VP', 'CFO', 'CEO', 'Custom'];

export const ApprovalNodeForm: React.FC<Props> = ({ data, onChange }) => {
  const isCustom = !ROLES.slice(0, -1).includes(data.approverRole);
  return (
    <div>
      <FormField label="Title" htmlFor="approval-title">
        <input id="approval-title" type="text" value={data.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="e.g., Manager Approval" className={inputClassName} />
      </FormField>
      <FormField label="Approver Role" htmlFor="approval-role">
        <select id="approval-role"
          value={isCustom && data.approverRole ? 'Custom' : data.approverRole}
          onChange={(e) => onChange({ approverRole: e.target.value === 'Custom' ? '' : e.target.value })}
          className={selectClassName}>
          {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
        {(isCustom || data.approverRole === '') && (
          <input type="text" value={data.approverRole}
            onChange={(e) => onChange({ approverRole: e.target.value })}
            placeholder="Enter custom role..." className={`${inputClassName} mt-2`}
            aria-label="Custom approver role" />
        )}
      </FormField>
      <FormField label="Auto-approve Threshold" htmlFor="approval-threshold"
                 hint="Days until auto-approve. Set to 0 to disable.">
        <input id="approval-threshold" type="number" value={data.autoApproveThreshold} min={0}
          onChange={(e) => onChange({ autoApproveThreshold: Number(e.target.value) })}
          className={inputClassName} />
      </FormField>
    </div>
  );
};
