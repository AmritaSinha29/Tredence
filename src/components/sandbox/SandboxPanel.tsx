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
    const result = validate(nodes, edges);
    setValidation(result);
    setActiveTab('validate');
  };

  const handleSimulate = async () => {
    // Validate first
    const vResult = validate(nodes, edges);
    setValidation(vResult);

    if (!vResult.isValid) {
      setActiveTab('validate');
      return;
    }

    setSimulating(true);
    setActiveTab('simulate');
    try {
      const result = await simulateWorkflow({
        nodes: nodes.map((n) => ({ id: n.id, type: n.type, data: n.data as never })),
        edges: edges.map((e) => ({ source: e.source, target: e.target })),
      });
      setSimulation(result);
    } catch (err) {
      console.error('Simulation failed:', err);
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="w-[560px] max-h-[80vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-scaleIn">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-violet-50 to-indigo-50">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Workflow Sandbox</h2>
            <p className="text-xs text-slate-500 mt-0.5">Validate structure & simulate execution</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/60 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Action buttons */}
        <div className="px-5 py-3 border-b border-slate-100 flex gap-2">
          <button
            onClick={handleValidate}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg
                       hover:bg-emerald-100 transition-colors text-sm font-medium border border-emerald-200"
          >
            <ShieldCheck size={16} />
            Validate
          </button>
          <button
            onClick={handleSimulate}
            disabled={simulating}
            className="flex items-center gap-2 px-4 py-2 bg-violet-50 text-violet-700 rounded-lg
                       hover:bg-violet-100 transition-colors text-sm font-medium border border-violet-200
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {simulating ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
            {simulating ? 'Simulating...' : 'Simulate'}
          </button>
        </div>

        {/* Tabs */}
        <div className="px-5 pt-3 flex gap-1">
          <button
            onClick={() => setActiveTab('validate')}
            className={`px-3 py-1.5 text-xs font-medium rounded-t-lg transition-colors ${
              activeTab === 'validate'
                ? 'bg-white text-slate-700 border border-b-0 border-slate-200'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Validation
          </button>
          <button
            onClick={() => setActiveTab('simulate')}
            className={`px-3 py-1.5 text-xs font-medium rounded-t-lg transition-colors ${
              activeTab === 'simulate'
                ? 'bg-white text-slate-700 border border-b-0 border-slate-200'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Simulation
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 border-t border-slate-200">
          {activeTab === 'validate' && (
            <div>
              {!validation ? (
                <p className="text-sm text-slate-400 text-center py-8">
                  Click "Validate" to check your workflow structure
                </p>
              ) : (
                <div className="space-y-3">
                  {/* Status banner */}
                  <div
                    className={`p-3 rounded-lg border flex items-center gap-2 ${
                      validation.isValid
                        ? 'bg-emerald-50 border-emerald-200'
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    {validation.isValid ? (
                      <CheckCircle size={18} className="text-emerald-500" />
                    ) : (
                      <XCircle size={18} className="text-red-500" />
                    )}
                    <span className={`text-sm font-medium ${validation.isValid ? 'text-emerald-700' : 'text-red-700'}`}>
                      {validation.isValid ? 'Workflow is valid!' : `${validation.errors.length} error(s) found`}
                    </span>
                  </div>

                  {/* Errors */}
                  {validation.errors.map((err, i) => (
                    <div key={i} className="flex items-start gap-2 p-2.5 bg-red-50 rounded-lg border border-red-100">
                      <XCircle size={14} className="text-red-400 mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-red-600">{err.message}</span>
                    </div>
                  ))}

                  {/* Warnings */}
                  {validation.warnings.map((warn, i) => (
                    <div key={i} className="flex items-start gap-2 p-2.5 bg-amber-50 rounded-lg border border-amber-100">
                      <AlertTriangle size={14} className="text-amber-400 mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-amber-600">{warn.message}</span>
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
                  <Loader2 size={32} className="text-violet-400 animate-spin" />
                  <p className="text-sm text-slate-400">Running simulation...</p>
                </div>
              ) : !simulation ? (
                <p className="text-sm text-slate-400 text-center py-8">
                  Click "Simulate" to run your workflow
                </p>
              ) : (
                <div className="space-y-4">
                  {/* Result banner */}
                  <div
                    className={`p-3 rounded-lg border flex items-center justify-between ${
                      simulation.status === 'completed'
                        ? 'bg-emerald-50 border-emerald-200'
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {simulation.status === 'completed' ? (
                        <CheckCircle size={18} className="text-emerald-500" />
                      ) : (
                        <XCircle size={18} className="text-red-500" />
                      )}
                      <span className={`text-sm font-medium ${
                        simulation.status === 'completed' ? 'text-emerald-700' : 'text-red-700'
                      }`}>
                        {simulation.status === 'completed' ? 'Simulation completed' : 'Simulation failed'}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500">{simulation.totalDuration}ms total</span>
                  </div>

                  {/* Timeline */}
                  <ExecutionTimeline steps={simulation.steps} />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-2.5 border-t border-slate-100 bg-slate-50/50">
          <p className="text-[10px] text-slate-400 text-center">
            {nodes.length} node{nodes.length !== 1 ? 's' : ''} · {edges.length} edge{edges.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
    </div>
  );
};
