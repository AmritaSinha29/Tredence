import React from 'react';
import { type TaskNodeData } from '../../types';
import { FormField, inputClassName, textareaClassName } from './shared/FormField';
import { KeyValueEditor } from './shared/KeyValueEditor';

interface Props { data: TaskNodeData; onChange: (d: Partial<TaskNodeData>) => void; }

export const TaskNodeForm: React.FC<Props> = ({ data, onChange }) => (
  <div>
    <FormField label="Title" required htmlFor="task-title"
               error={!data.title.trim() ? 'Title is required' : undefined}>
      <input id="task-title" type="text" value={data.title}
        onChange={(e) => onChange({ title: e.target.value })}
        placeholder="e.g., Collect Documents" className={inputClassName}
        aria-required="true" />
    </FormField>
    <FormField label="Description" htmlFor="task-desc">
      <textarea id="task-desc" value={data.description} rows={3}
        onChange={(e) => onChange({ description: e.target.value })}
        placeholder="Describe what this task involves..." className={textareaClassName} />
    </FormField>
    <FormField label="Assignee" htmlFor="task-assignee">
      <input id="task-assignee" type="text" value={data.assignee}
        onChange={(e) => onChange({ assignee: e.target.value })}
        placeholder="e.g., HR Coordinator" className={inputClassName} />
    </FormField>
    <FormField label="Due Date" htmlFor="task-due">
      <input id="task-due" type="date" value={data.dueDate}
        onChange={(e) => onChange({ dueDate: e.target.value })} className={inputClassName} />
    </FormField>
    <FormField label="Custom Fields" hint="Optional additional fields">
      <KeyValueEditor entries={data.customFields}
        onChange={(customFields) => onChange({ customFields })} />
    </FormField>
  </div>
);
