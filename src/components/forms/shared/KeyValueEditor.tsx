import React from 'react';
import { Plus, X } from 'lucide-react';

interface KeyValueEditorProps {
  entries: Record<string, string>;
  onChange: (entries: Record<string, string>) => void;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
}

export const KeyValueEditor: React.FC<KeyValueEditorProps> = ({
  entries, onChange, keyPlaceholder = 'Key', valuePlaceholder = 'Value',
}) => {
  const pairs = Object.entries(entries);

  const addPair = () => onChange({ ...entries, [`field_${pairs.length + 1}`]: '' });

  const removePair = (key: string) => {
    const next = { ...entries }; delete next[key]; onChange(next);
  };

  const updateKey = (oldKey: string, newKey: string) => {
    const next: Record<string, string> = {};
    for (const [k, v] of Object.entries(entries)) next[k === oldKey ? newKey : k] = v;
    onChange(next);
  };

  return (
    <div className="space-y-2" role="list" aria-label="Key-value pairs">
      {pairs.map(([key, value], i) => (
        <div key={i} className="flex items-center gap-1.5" role="listitem">
          <input type="text" value={key} onChange={(e) => updateKey(key, e.target.value)}
            placeholder={keyPlaceholder} aria-label={`Field ${i + 1} key`}
            className="flex-1 px-2.5 py-1.5 text-xs border border-[#e2e4ef] rounded-md bg-white
                       text-[#1e1f2e] placeholder:text-[#b4b6c8]
                       focus:outline-none focus:border-[#7c6cf0] focus:ring-2 focus:ring-[#ece9fd]" />
          <input type="text" value={value} onChange={(e) => onChange({ ...entries, [key]: e.target.value })}
            placeholder={valuePlaceholder} aria-label={`Field ${i + 1} value`}
            className="flex-1 px-2.5 py-1.5 text-xs border border-[#e2e4ef] rounded-md bg-white
                       text-[#1e1f2e] placeholder:text-[#b4b6c8]
                       focus:outline-none focus:border-[#7c6cf0] focus:ring-2 focus:ring-[#ece9fd]" />
          <button onClick={() => removePair(key)} aria-label={`Remove field ${key}`}
            className="p-1 text-[#b4b6c8] hover:text-[#e04e5e] hover:bg-[#fef0f1] rounded transition-colors">
            <X size={14} />
          </button>
        </div>
      ))}
      <button onClick={addPair}
        className="flex items-center gap-1 text-xs text-[#7c6cf0] hover:text-[#6354d4] font-medium mt-1 transition-colors">
        <Plus size={14} /> Add field
      </button>
    </div>
  );
};
