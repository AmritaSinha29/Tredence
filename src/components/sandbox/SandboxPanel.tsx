import React, { useState } from 'react';
import { Play, ShieldCheck, X, Loader2, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useWorkflowStore } from '../../store/workflowStore';
import { useValidation } from '../../hooks/useValidation';
import { simulateWorkflow } from '../../api/mockApi';
import { type ValidationResult, type SimulationResult } from '../../types';
import { ExecutionTimeline } from './ExecutionTimeline';

interface SandboxPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SandboxPanel: React.FC<SandboxPanelProps> = ({ isOpen, onClose }) => {
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const { validate } = useValidation();

  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [simulation, setSimulation] = useState<SimulationResult | null>(null);
  const [simulating, setSimulating] = useState(false);
  const [activeTab, setActiveTab] = useState<'validate' | 'simulate'>('validate');

  if (!isOpen) return null;

  const handleValidate = () => {
    setValidation(validate(nodes, edges));
    setActiveTab('validate');
  };

  const handleSimulate = async () => {
    const vResult = validate(nodes, edges);
    setValidation(vResult);
    if (!vResult.isValid) { setActiveTab('validate'); return; }
    setSimulating(true);
    setActiveTab('simulate');
    try {
      const result = await simulateWorkflow({
        nodes: nodes.map((n) => ({ id: n.id, type: n.type, data: n.data as never })),
        edges: edges.map((e) => ({ source: e.source, target: e.target })),
      });
      setSimulation(result);
    } catch (err) { console.error('Simulation failed:', err); }
    finally { setSimulating(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-[560px] max-h-[80vh] glass-strong rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-scaleIn
                      border border-white/[0.08]"
           style={{ boxShadow: '0 24px 80px rgba(0,0,0,0.5), 0 0 60px rgba(139,92,246,0.08)' }}>
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between"
             style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(236,72,153,0.04), transparent)' }}>
          <div>
            <h2 className="text-lg font-bold text-white/90">Workflow Sandbox</h2>
            <p className="text-xs text-white/30 mt-0.5">Validate structure & simulate execution</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/[0.06] text-white/30 hover:text-white/60 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Actions */}
        <div className="px-5 py-3 border-b border-white/[0.06] flex gap-2">
          <button onClick={handleValidate}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                       bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/15">
            <ShieldCheck size={16} /> Validate
          </button>
          <button onClick={handleSimulate} disabled={simulating}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                       bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/15
                       disabled:opacity-40 disabled:cursor-not-allowed">
            {simulating ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
            {simulating ? 'Simulating...' : 'Simulate'}
          </button>
        </div>

        {/* Tabs */}
        <div className="px-5 pt-3 flex gap-1">
          {(['validate', 'simulate'] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-xs font-medium rounded-t-lg transition-colors capitalize ${
                activeTab === tab ? 'bg-white/[0.06] text-white/80 border border-b-0 border-white/[0.08]' : 'text-white/30 hover:text-white/50'
              }`}>
              {tab === 'validate' ? 'Validation' : 'Simulation'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 border-t border-white/[0.06]">
          {activeTab === 'validate' && (
            <div>
              {!validation ? (
                <p className="text-sm text-white/25 text-center py-8">Click "Validate" to check your workflow structure</p>
              ) : (
                <div className="space-y-3">
                  <div className={`p-3 rounded-lg border flex items-center gap-2 ${
                    validation.isValid ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'
                  }`}>
                    {validation.isValid ? <CheckCircle size={18} className="text-emerald-400" /> : <XCircle size={18} className="text-red-400" />}
                    <span className={`text-sm font-medium ${validation.isValid ? 'text-emerald-400' : 'text-red-400'}`}>
                      {validation.isValid ? 'Workflow is valid!' : `${validation.errors.length} error(s) found`}
                    </span>
                  </div>
                  {validation.errors.map((err, i) => (
                    <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-red-500/[0.06] border border-red-500/10">
                      <XCircle size={14} className="text-red-400/70 mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-red-300/80">{err.message}</span>
                    </div>
                  ))}
                  {validation.warnings.map((warn, i) => (
                    <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-500/[0.06] border border-amber-500/10">
                      <AlertTriangle size={14} className="text-amber-400/70 mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-amber-300/80">{warn.message}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'simulate' && (
            <div>
              {simulating ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <Loader2 size={32} className="text-purple-400 animate-spin" />
                  <p className="text-sm text-white/30">Running simulation...</p>
                </div>
              ) : !simulation ? (
                <p className="text-sm text-white/25 text-center py-8">Click "Simulate" to run your workflow</p>
              ) : (
                <div className="space-y-4">
                  <div className={`p-3 rounded-lg border flex items-center justify-between ${
                    simulation.status === 'completed' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'
                  }`}>
                    <div className="flex items-center gap-2">
                      {simulation.status === 'completed' ? <CheckCircle size={18} className="text-emerald-400" /> : <XCircle size={18} className="text-red-400" />}
                      <span className={`text-sm font-medium ${simulation.status === 'completed' ? 'text-emerald-400' : 'text-red-400'}`}>
                        {simulation.status === 'completed' ? 'Simulation completed' : 'Simulation failed'}
                      </span>
                    </div>
                    <span className="text-xs text-white/30">{simulation.totalDuration}ms</span>
                  </div>
                  <ExecutionTimeline steps={simulation.steps} />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-2.5 border-t border-white/[0.06]">
          <p className="text-[10px] text-white/20 text-center">
            {nodes.length} node{nodes.length !== 1 ? 's' : ''} · {edges.length} edge{edges.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
    </div>
  );
};
