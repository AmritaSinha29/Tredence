import React from 'react';
import { Plus, X } from 'lucide-react';

interface KeyValueEditorProps {
  entries: Record<string, string>;
  onChange: (entries: Record<string, string>) => void;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
}

export const KeyValueEditor: React.FC<KeyValueEditorProps> = ({
  entries,
  onChange,
  keyPlaceholder = 'Key',
  valuePlaceholder = 'Value',
}) => {
  const pairs = Object.entries(entries);

  const addPair = () => {
    const newKey = `field_${pairs.length + 1}`;
    onChange({ ...entries, [newKey]: '' });
  };

  const removePair = (key: string) => {
    const next = { ...entries };
    delete next[key];
    onChange(next);
  };

  const updateKey = (oldKey: string, newKey: string) => {
    const next: Record<string, string> = {};
    for (const [k, v] of Object.entries(entries)) {
      next[k === oldKey ? newKey : k] = v;
    }
    onChange(next);
  };

  const updateValue = (key: string, value: string) => {
    onChange({ ...entries, [key]: value });
  };

  return (
    <div className="space-y-2">
      {pairs.map(([key, value], index) => (
        <div key={index} className="flex items-center gap-1.5">
          <input
            type="text"
            value={key}
            onChange={(e) => updateKey(key, e.target.value)}
            placeholder={keyPlaceholder}
            className="flex-1 px-2 py-1.5 text-xs bg-white/[0.04] border border-white/[0.08] rounded-md
                       text-white/80 placeholder:text-white/20
                       focus:outline-none focus:ring-2 focus:ring-purple-500/25"
          />
          <input
            type="text"
            value={value}
            onChange={(e) => updateValue(key, e.target.value)}
            placeholder={valuePlaceholder}
            className="flex-1 px-2 py-1.5 text-xs bg-white/[0.04] border border-white/[0.08] rounded-md
                       text-white/80 placeholder:text-white/20
                       focus:outline-none focus:ring-2 focus:ring-purple-500/25"
          />
          <button
            onClick={() => removePair(key)}
            className="p-1 text-pink-400/60 hover:text-pink-400 hover:bg-pink-500/10 rounded transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      ))}
      <button
        onClick={addPair}
        className="flex items-center gap-1 text-xs text-purple-400/70 hover:text-purple-400 
                   transition-colors font-medium mt-1"
      >
        <Plus size={14} />
        Add field
      </button>
    </div>
  );
};
