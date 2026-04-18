import React from 'react';
import { type AutomatedStepNodeData } from '../../types';
import { FormField, inputClassName, selectClassName } from './shared/FormField';
import { useAutomations } from '../../hooks/useAutomations';

interface AutomatedStepNodeFormProps {
  data: AutomatedStepNodeData;
  onChange: (data: Partial<AutomatedStepNodeData>) => void;
}

export const AutomatedStepNodeForm: React.FC<AutomatedStepNodeFormProps> = ({ data, onChange }) => {
  const { automations, loading } = useAutomations();

  const selectedAction = automations.find((a) => a.id === data.actionId);

  const handleActionChange = (actionId: string) => {
    const action = automations.find((a) => a.id === actionId);
    const newParams: Record<string, string> = {};
    if (action) {
      action.params.forEach((p) => {
        newParams[p] = data.actionParams?.[p] || '';
      });
    }
    onChange({ actionId, actionParams: newParams });
  };

  return (
    <div>
      <FormField label="Title">
        <input
          type="text"
          value={data.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="e.g., Send Welcome Email"
          className={inputClassName}
        />
      </FormField>

      <FormField label="Action">
        {loading ? (
          <div className="flex items-center gap-2 text-xs text-slate-400 py-2">
            <div className="w-3 h-3 border-2 border-violet-300 border-t-transparent rounded-full animate-spin" />
            Loading actions...
          </div>
        ) : (
          <select
            value={data.actionId}
            onChange={(e) => handleActionChange(e.target.value)}
            className={selectClassName}
          >
            <option value="">Select an action...</option>
            {automations.map((action) => (
              <option key={action.id} value={action.id}>
                {action.label}
              </option>
            ))}
          </select>
        )}
      </FormField>

      {/* Dynamic parameters based on selected action */}
      {selectedAction && selectedAction.params.length > 0 && (
        <div className="mt-2 p-3 bg-violet-50/50 rounded-lg border border-violet-100">
          <p className="text-xs font-semibold text-violet-600 mb-2">Action Parameters</p>
          {selectedAction.params.map((param) => (
            <FormField key={param} label={param.charAt(0).toUpperCase() + param.slice(1)}>
              <input
                type="text"
                value={data.actionParams?.[param] || ''}
                onChange={(e) =>
                  onChange({
                    actionParams: { ...data.actionParams, [param]: e.target.value },
                  })
                }
                placeholder={`Enter ${param}...`}
                className={inputClassName}
              />
            </FormField>
          ))}
        </div>
      )}
    </div>
  );
};
