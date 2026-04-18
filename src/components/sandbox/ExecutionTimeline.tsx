import React from 'react';
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { type SimulationStep } from '../../types';

interface ExecutionTimelineProps {
  steps: SimulationStep[];
}

const STATUS_CONFIG = {
  completed: { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  failed: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
  skipped: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  pending: { icon: Clock, color: 'text-white/30', bg: 'bg-white/5', border: 'border-white/10' },
};

const NODE_TYPE_LABELS: Record<string, string> = {
  start: 'Start', task: 'Task', approval: 'Approval', automated: 'Automated', end: 'End',
};

export const ExecutionTimeline: React.FC<ExecutionTimelineProps> = ({ steps }) => {
  return (
    <div className="space-y-0">
      {steps.map((step, index) => {
        const config = STATUS_CONFIG[step.status];
        const Icon = config.icon;
        const isLast = index === steps.length - 1;
        return (
          <div key={step.nodeId + index} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={`w-7 h-7 rounded-full ${config.bg} border ${config.border} flex items-center justify-center flex-shrink-0`}>
                <Icon size={14} className={config.color} />
              </div>
              {!isLast && <div className="w-0.5 h-full bg-white/[0.06] min-h-[24px]" />}
            </div>
            <div className="pb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white/80">{step.title}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/[0.06] text-white/40 font-medium">
                  {NODE_TYPE_LABELS[step.nodeType] || step.nodeType}
                </span>
              </div>
              <p className="text-xs text-white/40 mt-0.5">{step.message}</p>
              <p className="text-[10px] text-white/20 mt-0.5">{step.duration}ms</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
