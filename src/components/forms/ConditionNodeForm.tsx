import React from 'react';
import { type ConditionNodeData } from '../../types';
import { FormField, inputClassName, selectClassName } from './shared/FormField';

interface Props {
  data: ConditionNodeData;
  onChange: (d: Partial<ConditionNodeData>) => void;
}

export const ConditionNodeForm: React.FC<Props> = ({ data, onChange }) => {
  return (
    <div className="space-y-4">
      <FormField label="Title" htmlFor="cond-title">
        <input
          id="cond-title"
          type="text"
          value={data.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="e.g., Is Manager Approval Needed?"
          className={inputClassName}
        />
      </FormField>

      <FormField label="Variable Name" htmlFor="cond-variable">
        <input
          id="cond-variable"
          type="text"
          value={data.variable}
          onChange={(e) => onChange({ variable: e.target.value })}
          placeholder="e.g., role, amount, days"
          className={inputClassName}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Operator" htmlFor="cond-operator">
          <select
            id="cond-operator"
            value={data.operator}
            onChange={(e) => onChange({ operator: e.target.value as ConditionNodeData['operator'] })}
            className={selectClassName}
          >
            <option value="equals">Equals (==)</option>
            <option value="not_equals">Not Equals (!=)</option>
            <option value="greater_than">Greater Than (&gt;)</option>
            <option value="less_than">Less Than (&lt;)</option>
            <option value="contains">Contains</option>
          </select>
        </FormField>

        <FormField label="Target Value" htmlFor="cond-value">
          <input
            id="cond-value"
            type="text"
            value={data.value}
            onChange={(e) => onChange({ value: e.target.value })}
            placeholder="e.g., 5000"
            className={inputClassName}
          />
        </FormField>
      </div>
      
      <div className="p-3 rounded-md bg-[#fef8eb] border border-[#f5dfa0]">
        <p className="text-[11px] text-[#e89e1c] font-medium leading-relaxed">
          <strong className="font-bold">Note:</strong> Condition nodes require exactly two outgoing connections (True and False). During simulation, only one path will execute.
        </p>
      </div>
    </div>
  );
};
