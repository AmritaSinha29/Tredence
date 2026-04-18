import React from 'react';
import { type StartNodeData } from '../../types';
import { FormField, inputClassName } from './shared/FormField';
import { KeyValueEditor } from './shared/KeyValueEditor';

interface StartNodeFormProps {
  data: StartNodeData;
  onChange: (data: Partial<StartNodeData>) => void;
}

export const StartNodeForm: React.FC<StartNodeFormProps> = ({ data, onChange }) => {
  return (
    <div>
      <FormField label="Start Title">
        <input
          type="text"
          value={data.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="e.g., Employee Onboarding"
          className={inputClassName}
        />
      </FormField>

      <FormField label="Metadata (Optional)">
        <KeyValueEditor
          entries={data.metadata || {}}
          onChange={(metadata) => onChange({ metadata })}
          keyPlaceholder="Key"
          valuePlaceholder="Value"
        />
      </FormField>
    </div>
  );
};
