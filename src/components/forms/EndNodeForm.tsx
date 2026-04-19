import React from 'react';
import { type EndNodeData } from '../../types';
import { FormField, inputClassName } from './shared/FormField';

interface Props { data: EndNodeData; onChange: (d: Partial<EndNodeData>) => void; }

export const EndNodeForm: React.FC<Props> = ({ data, onChange }) => (
  <div>
    <FormField label="End Message" htmlFor="end-msg">
      <input id="end-msg" type="text" value={data.endMessage}
        onChange={(e) => onChange({ endMessage: e.target.value })}
        placeholder="e.g., Workflow Complete!" className={inputClassName} />
    </FormField>
    <FormField label="Show Summary">
      <label className="flex items-center gap-3 cursor-pointer group" htmlFor="end-summary">
        <div className="relative">
          <input id="end-summary" type="checkbox" checked={data.showSummary}
            onChange={(e) => onChange({ showSummary: e.target.checked })} className="sr-only" />
          <div className={`w-10 h-[22px] rounded-full transition-colors duration-200 ${
            data.showSummary ? 'bg-[#0F3D4C]' : 'bg-[#e2e4ef]'}`} />
          <div className={`absolute top-[3px] left-[3px] w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${
            data.showSummary ? 'translate-x-[18px]' : 'translate-x-0'}`} />
        </div>
        <span className="text-[13px] text-[#5a5c78]">
          {data.showSummary ? 'Summary enabled' : 'No summary'}
        </span>
      </label>
    </FormField>
  </div>
);
