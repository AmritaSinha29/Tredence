import React from 'react';
import { type StartNodeData } from '../../types';
import { FormField, inputClassName } from './shared/FormField';
import { KeyValueEditor } from './shared/KeyValueEditor';

interface Props { data: StartNodeData; onChange: (d: Partial<StartNodeData>) => void; }

export const StartNodeForm: React.FC<Props> = ({ data, onChange }) => (
  <div>
    <FormField label="Title" htmlFor="start-title">
      <input id="start-title" type="text" value={data.title}
        onChange={(e) => onChange({ title: e.target.value })}
        placeholder="e.g., Employee Onboarding" className={inputClassName} />
    </FormField>
    <FormField label="Metadata" hint="Add key-value pairs for workflow context">
      <KeyValueEditor entries={data.metadata} onChange={(metadata) => onChange({ metadata })} />
    </FormField>
  </div>
);
