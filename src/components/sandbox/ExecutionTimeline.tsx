import React from 'react';
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { type SimulationStep } from '../../types';

interface Props { steps: SimulationStep[]; }

const CFG = {
  completed: { Icon: CheckCircle, color: 'text-[#22a86b]', bg: 'bg-[#e7f8f0]', border: 'border-[#c5e8d8]' },
  failed:    { Icon: XCircle,     color: 'text-[#e04e5e]', bg: 'bg-[#fef0f1]', border: 'border-[#f5c4ca]' },
  skipped:   { Icon: AlertTriangle, color: 'text-[#e89e1c]', bg: 'bg-[#fef8eb]', border: 'border-[#f5dfa0]' },
  pending:   { Icon: Clock,       color: 'text-[#8e90a6]', bg: 'bg-[#f5f6fa]', border: 'border-[#e2e4ef]' },
};

const TYPE_LABELS: Record<string, string> = {
  start: 'Start', task: 'Task', approval: 'Approval', automated: 'Automated', end: 'End',
};

export const ExecutionTimeline: React.FC<Props> = ({ steps }) => (
  <ol className="space-y-0" aria-label="Execution timeline">
    {steps.map((step, i) => {
      const c = CFG[step.status];
      const isLast = i === steps.length - 1;
      return (
        <li key={step.nodeId + i} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className={`w-7 h-7 rounded-full ${c.bg} border ${c.border} flex items-center justify-center flex-shrink-0`}>
              <c.Icon size={14} className={c.color} />
            </div>
            {!isLast && <div className="w-0.5 h-full bg-[#e2e4ef] min-h-[24px]" />}
          </div>
          <div className="pb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-[#1e1f2e]">{step.title}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#f5f6fa] text-[#8e90a6] font-medium border border-[#e2e4ef]">
                {TYPE_LABELS[step.nodeType] || step.nodeType}
              </span>
            </div>
            <p className="text-xs text-[#5a5c78] mt-0.5">{step.message}</p>
            <p className="text-[10px] text-[#b4b6c8] mt-0.5">{step.duration}ms</p>
          </div>
        </li>
      );
    })}
  </ol>
);
