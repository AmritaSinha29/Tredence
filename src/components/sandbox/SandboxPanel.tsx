import React, { useState } from 'react';
import { Play, ShieldCheck, X, Loader2, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useWorkflowStore } from '../../store/workflowStore';
import { useValidation } from '../../hooks/useValidation';
import { simulateWorkflow } from '../../api/mockApi';
import { type ValidationResult, type SimulationResult } from '../../types';
import { ExecutionTimeline } from './ExecutionTimeline';

interface Props { isOpen: boolean; onClose: () => void; }

export const SandboxPanel: React.FC<Props> = ({ isOpen, onClose }) => {
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const { validate } = useValidation();

  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [simulation, setSimulation] = useState<SimulationResult | null>(null);
  const [simulating, setSimulating] = useState(false);
  const [tab, setTab] = useState<'validate' | 'simulate'>('validate');

  if (!isOpen) return null;

  const handleValidate = () => { setValidation(validate(nodes, edges)); setTab('validate'); };

  const handleSimulate = async () => {
    const v = validate(nodes, edges);
    setValidation(v);
    if (!v.isValid) { setTab('validate'); return; }
    setSimulating(true); setTab('simulate');
    try {
      const r = await simulateWorkflow({
        nodes: nodes.map((n) => ({ id: n.id, type: n.type, data: n.data as never })),
        edges: edges.map((e) => ({ source: e.source, target: e.target })),
      });
      setSimulation(r);
    } catch { /* handled */ }
    finally { setSimulating(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
         role="dialog" aria-modal="true" aria-label="Workflow Sandbox">
      <div className="w-[560px] max-h-[80vh] bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden animate-fadeIn border border-[#e2e4ef]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#e2e4ef] flex items-center justify-between bg-[#f8f9fc]">
          <div>
            <h2 className="text-lg font-bold text-[#1e1f2e]">Workflow Sandbox</h2>
            <p className="text-xs text-[#8e90a6] mt-0.5">Validate structure & simulate execution</p>
          </div>
          <button onClick={onClose} aria-label="Close sandbox"
            className="p-2 rounded-lg hover:bg-[#f0f1f8] text-[#8e90a6] hover:text-[#5a5c78] transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Actions */}
        <div className="px-5 py-3 border-b border-[#e2e4ef] flex gap-2">
          <button onClick={handleValidate}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                       bg-[#e7f8f0] text-[#22a86b] border border-[#c5e8d8] hover:bg-[#d4f1e4]">
            <ShieldCheck size={16} /> Validate
          </button>
          <button onClick={handleSimulate} disabled={simulating}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                       bg-[#f5f3fe] text-[#7c6cf0] border border-[#d4cef8] hover:bg-[#ece9fd]
                       disabled:opacity-40 disabled:cursor-not-allowed">
            {simulating ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
            {simulating ? 'Running...' : 'Simulate'}
          </button>
        </div>

        {/* Tabs */}
        <div className="px-5 pt-3 flex gap-1 border-b border-[#e2e4ef]">
          {(['validate', 'simulate'] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-3 py-2 text-xs font-medium transition-colors capitalize -mb-px
                ${tab === t
                  ? 'text-[#7c6cf0] border-b-2 border-[#7c6cf0]'
                  : 'text-[#8e90a6] hover:text-[#5a5c78]'}`}>
              {t === 'validate' ? 'Validation' : 'Simulation'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {tab === 'validate' && (
            !validation ? (
              <p className="text-sm text-[#b4b6c8] text-center py-8">Click "Validate" to check your workflow</p>
            ) : (
              <div className="space-y-3">
                <div className={`p-3 rounded-lg border flex items-center gap-2 ${
                  validation.isValid ? 'bg-[#e7f8f0] border-[#c5e8d8]' : 'bg-[#fef0f1] border-[#f5c4ca]'}`}>
                  {validation.isValid
                    ? <CheckCircle size={18} className="text-[#22a86b]" />
                    : <XCircle size={18} className="text-[#e04e5e]" />}
                  <span className={`text-sm font-medium ${validation.isValid ? 'text-[#22a86b]' : 'text-[#e04e5e]'}`}>
                    {validation.isValid ? 'Workflow is valid!' : `${validation.errors.length} error(s) found`}
                  </span>
                </div>
                {validation.errors.map((e, i) => (
                  <div key={i} className="flex items-start gap-2 p-3 rounded-lg bg-[#fef0f1] border border-[#f5c4ca]">
                    <XCircle size={14} className="text-[#e04e5e] mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-[#5a5c78]">{e.message}</span>
                  </div>
                ))}
                {validation.warnings.map((w, i) => (
                  <div key={i} className="flex items-start gap-2 p-3 rounded-lg bg-[#fef8eb] border border-[#f5dfa0]">
                    <AlertTriangle size={14} className="text-[#e89e1c] mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-[#5a5c78]">{w.message}</span>
                  </div>
                ))}
              </div>
            )
          )}
          {tab === 'simulate' && (
            simulating ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <Loader2 size={28} className="text-[#7c6cf0] animate-spin" />
                <p className="text-sm text-[#8e90a6]">Running simulation...</p>
              </div>
            ) : !simulation ? (
              <p className="text-sm text-[#b4b6c8] text-center py-8">Click "Simulate" to run your workflow</p>
            ) : (
              <div className="space-y-4">
                <div className={`p-3 rounded-lg border flex items-center justify-between ${
                  simulation.status === 'completed' ? 'bg-[#e7f8f0] border-[#c5e8d8]' : 'bg-[#fef0f1] border-[#f5c4ca]'}`}>
                  <div className="flex items-center gap-2">
                    {simulation.status === 'completed'
                      ? <CheckCircle size={18} className="text-[#22a86b]" />
                      : <XCircle size={18} className="text-[#e04e5e]" />}
                    <span className={`text-sm font-medium ${simulation.status === 'completed' ? 'text-[#22a86b]' : 'text-[#e04e5e]'}`}>
                      {simulation.status === 'completed' ? 'Simulation completed' : 'Simulation failed'}
                    </span>
                  </div>
                  <span className="text-xs text-[#8e90a6]">{simulation.totalDuration}ms total</span>
                </div>
                <ExecutionTimeline steps={simulation.steps} />
              </div>
            )
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-2.5 border-t border-[#e2e4ef] bg-[#f8f9fc]">
          <p className="text-[10px] text-[#b4b6c8] text-center">
            {nodes.length} node{nodes.length !== 1 ? 's' : ''} · {edges.length} edge{edges.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
    </div>
  );
};
