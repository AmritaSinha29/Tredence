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
    if (action) action.params.forEach((p) => { newParams[p] = data.actionParams?.[p] || ''; });
    onChange({ actionId, actionParams: newParams });
  };

  return (
    <div>
      <FormField label="Title">
        <input type="text" value={data.title} onChange={(e) => onChange({ title: e.target.value })}
          placeholder="e.g., Send Welcome Email" className={inputClassName} />
      </FormField>

      <FormField label="Action">
        {loading ? (
          <div className="flex items-center gap-2 text-xs text-white/30 py-2">
            <div className="w-3 h-3 border-2 border-purple-400/50 border-t-transparent rounded-full animate-spin" />
            Loading actions...
          </div>
        ) : (
          <select value={data.actionId} onChange={(e) => handleActionChange(e.target.value)} className={selectClassName}>
            <option value="">Select an action...</option>
            {automations.map((action) => (
              <option key={action.id} value={action.id}>{action.label}</option>
            ))}
          </select>
        )}
      </FormField>

      {selectedAction && selectedAction.params.length > 0 && (
        <div className="mt-2 p-3 rounded-lg border border-purple-500/15 bg-purple-500/[0.04]">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-purple-400/70 mb-2.5">Action Parameters</p>
          {selectedAction.params.map((param) => (
            <FormField key={param} label={param.charAt(0).toUpperCase() + param.slice(1)}>
              <input type="text" value={data.actionParams?.[param] || ''}
                onChange={(e) => onChange({ actionParams: { ...data.actionParams, [param]: e.target.value } })}
                placeholder={`Enter ${param}...`} className={inputClassName} />
            </FormField>
          ))}
        </div>
      )}
    </div>
  );
};
