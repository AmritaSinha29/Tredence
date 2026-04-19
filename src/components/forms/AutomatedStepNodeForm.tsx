import React from 'react';
import { type AutomatedStepNodeData } from '../../types';
import { FormField, inputClassName, selectClassName } from './shared/FormField';
import { useAutomations } from '../../hooks/useAutomations';

interface Props { data: AutomatedStepNodeData; onChange: (d: Partial<AutomatedStepNodeData>) => void; }

export const AutomatedStepNodeForm: React.FC<Props> = ({ data, onChange }) => {
  const { automations, loading } = useAutomations();
  const selected = automations.find((a) => a.id === data.actionId);

  const handleActionChange = (actionId: string) => {
    const action = automations.find((a) => a.id === actionId);
    const params: Record<string, string> = {};
    if (action) action.params.forEach((p) => { params[p] = data.actionParams?.[p] || ''; });
    onChange({ actionId, actionParams: params });
  };

  return (
    <div>
      <FormField label="Title" htmlFor="auto-title">
        <input id="auto-title" type="text" value={data.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="e.g., Send Welcome Email" className={inputClassName} />
      </FormField>
      <FormField label="Action" htmlFor="auto-action">
        {loading ? (
          <div className="flex items-center gap-2 text-xs text-[#8e90a6] py-2">
            <div className="w-3 h-3 border-2 border-[#0F3D4C] border-t-transparent rounded-full animate-spin" />
            Loading actions from API...
          </div>
        ) : (
          <select id="auto-action" value={data.actionId}
            onChange={(e) => handleActionChange(e.target.value)} className={selectClassName}>
            <option value="">Select an action...</option>
            {automations.map((a) => <option key={a.id} value={a.id}>{a.label}</option>)}
          </select>
        )}
      </FormField>
      {selected && selected.params.length > 0 && (
        <div className="p-3 rounded-md border border-[#C5D9E0] bg-[#F2F6F8]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#0F3D4C] mb-3">
            Action Parameters
          </p>
          {selected.params.map((param) => (
            <FormField key={param} label={param.replace(/_/g, ' ')} htmlFor={`param-${param}`}>
              <input id={`param-${param}`} type="text" value={data.actionParams?.[param] || ''}
                onChange={(e) => onChange({ actionParams: { ...data.actionParams, [param]: e.target.value } })}
                placeholder={`Enter ${param}...`} className={inputClassName} />
            </FormField>
          ))}
        </div>
      )}
    </div>
  );
};
