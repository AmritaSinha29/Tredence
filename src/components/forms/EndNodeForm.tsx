import React from 'react';
import { type EndNodeData } from '../../types';
import { FormField, inputClassName } from './shared/FormField';

interface EndNodeFormProps {
  data: EndNodeData;
  onChange: (data: Partial<EndNodeData>) => void;
}

export const EndNodeForm: React.FC<EndNodeFormProps> = ({ data, onChange }) => {
  return (
    <div>
      <FormField label="End Message">
        <input
          type="text"
          value={data.endMessage}
          onChange={(e) => onChange({ endMessage: e.target.value })}
          placeholder="e.g., Workflow Complete!"
          className={inputClassName}
        />
      </FormField>

      <FormField label="Show Summary">
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative">
            <input
              type="checkbox"
              checked={data.showSummary}
              onChange={(e) => onChange({ showSummary: e.target.checked })}
              className="sr-only"
            />
            <div
              className={`w-10 h-5 rounded-full transition-colors duration-200 ${
                data.showSummary ? 'bg-purple-500' : 'bg-white/10'
              }`}
            />
            <div
              className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                data.showSummary ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </div>
          <span className="text-[13px] text-white/50 group-hover:text-white/70 transition-colors">
            {data.showSummary ? 'Summary will be displayed' : 'No summary'}
          </span>
        </label>
      </FormField>
    </div>
  );
};
