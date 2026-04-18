import React from 'react';
import { type TaskNodeData } from '../../types';
import { FormField, inputClassName, textareaClassName } from './shared/FormField';
import { KeyValueEditor } from './shared/KeyValueEditor';

interface TaskNodeFormProps {
  data: TaskNodeData;
  onChange: (data: Partial<TaskNodeData>) => void;
}

export const TaskNodeForm: React.FC<TaskNodeFormProps> = ({ data, onChange }) => {
  return (
    <div>
      <FormField label="Title" required error={!data.title?.trim() ? 'Title is required' : undefined}>
        <input
          type="text"
          value={data.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="e.g., Collect Documents"
          className={inputClassName}
        />
      </FormField>

      <FormField label="Description">
        <textarea
          value={data.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Describe the task..."
          rows={3}
          className={textareaClassName}
        />
      </FormField>

      <FormField label="Assignee">
        <input
          type="text"
          value={data.assignee}
          onChange={(e) => onChange({ assignee: e.target.value })}
          placeholder="e.g., HR Coordinator"
          className={inputClassName}
        />
      </FormField>

      <FormField label="Due Date">
        <input
          type="date"
          value={data.dueDate}
          onChange={(e) => onChange({ dueDate: e.target.value })}
          className={inputClassName}
        />
      </FormField>

      <FormField label="Custom Fields (Optional)">
        <KeyValueEditor
          entries={data.customFields || {}}
          onChange={(customFields) => onChange({ customFields })}
          keyPlaceholder="Field name"
          valuePlaceholder="Field value"
        />
      </FormField>
    </div>
  );
};
