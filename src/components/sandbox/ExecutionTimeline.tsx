import React from 'react';
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { type SimulationStep } from '../../types';

interface ExecutionTimelineProps {
  steps: SimulationStep[];
}

const STATUS_CONFIG = {
  completed: { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  failed: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' },
  skipped: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200' },
  pending: { icon: Clock, color: 'text-slate-400', bg: 'bg-slate-50', border: 'border-slate-200' },
};

const NODE_TYPE_LABELS: Record<string, string> = {
  start: 'Start',
  task: 'Task',
  approval: 'Approval',
  automated: 'Automated',
  end: 'End',
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
            {/* Timeline line */}
            <div className="flex flex-col items-center">
              <div className={`w-7 h-7 rounded-full ${config.bg} border ${config.border} flex items-center justify-center flex-shrink-0`}>
                <Icon size={14} className={config.color} />
              </div>
              {!isLast && <div className="w-0.5 h-full bg-slate-200 min-h-[24px]" />}
            </div>

            {/* Step content */}
            <div className={`pb-4 ${isLast ? '' : ''}`}>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-700">{step.title}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium">
                  {NODE_TYPE_LABELS[step.nodeType] || step.nodeType}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{step.message}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{step.duration}ms</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
