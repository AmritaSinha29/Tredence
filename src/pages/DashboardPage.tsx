import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Workflow, Plus, FileJson, Clock, BarChart3,
  ArrowRight, Play, ClipboardList, UserCheck, Zap, Square,
  Layers, Activity, CheckCircle,
} from 'lucide-react';
import { useWorkflowStore } from '../store/workflowStore';

type TemplateId = 'onboarding' | 'leave-approval' | 'doc-verification' | 'exit-process' | 'performance-review';

const STATS = [
  { label: 'Active Workflows', value: '12', icon: Activity, color: '#7c6cf0', bg: '#f5f3fe', to: '/templates' as const },
  { label: 'Templates Available', value: '5', icon: Layers, color: '#4a8ff7', bg: '#f0f5ff', to: '/templates' as const },
  { label: 'Completed Today', value: '8', icon: CheckCircle, color: '#22a86b', bg: '#e7f8f0', to: '/designer' as const },
  { label: 'Avg. Completion', value: '2.4h', icon: Clock, color: '#e89e1c', bg: '#fef8eb', to: '/designer' as const },
];

const RECENT: { name: string; nodes: number; status: string; updated: string; template: TemplateId }[] = [
  { name: 'Employee Onboarding — Q2', nodes: 6, status: 'active', updated: '2 hours ago', template: 'onboarding' },
  { name: 'Annual Leave Request Flow', nodes: 7, status: 'draft', updated: '5 hours ago', template: 'leave-approval' },
  { name: 'Document Verification', nodes: 5, status: 'active', updated: '1 day ago', template: 'doc-verification' },
  { name: 'Exit Process Workflow', nodes: 8, status: 'draft', updated: '3 days ago', template: 'exit-process' },
];

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const loadTemplate = useWorkflowStore((s) => s.loadTemplate);

  const openWorkflow = (template: TemplateId) => {
    loadTemplate(template);
    navigate('/designer');
  };

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-[1200px] mx-auto">
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#1e1f2e]">Welcome back</h2>
          <p className="text-sm text-[#8e90a6] mt-1">Design, validate, and simulate HR workflows — all in one place.</p>
        </div>

        {/* Stats Grid — each clickable */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {STATS.map((s) => (
            <Link key={s.label} to={s.to}
              className="bg-white rounded-xl border border-[#e2e4ef] p-4 flex items-center gap-4 shadow-sm
                         hover:shadow-md hover:border-[#d0d3e4] transition-all cursor-pointer group">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                   style={{ backgroundColor: s.bg, color: s.color }}>
                <s.icon size={20} />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#1e1f2e]">{s.value}</div>
                <div className="text-[11px] text-[#8e90a6] font-medium">{s.label}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions + Recent */}
        <div className="grid grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-[#1e1f2e] mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Link to="/designer"
                className="flex items-center gap-3 p-3.5 bg-[#7c6cf0] text-white rounded-xl shadow-sm hover:bg-[#6354d4] transition-colors">
                <Plus size={18} />
                <div>
                  <div className="text-sm font-semibold">New Workflow</div>
                  <div className="text-[11px] text-white/70">Start from scratch</div>
                </div>
              </Link>
              <Link to="/templates"
                className="flex items-center gap-3 p-3.5 bg-white border border-[#e2e4ef] rounded-xl shadow-sm hover:bg-[#f8f9fc] transition-colors">
                <FileJson size={18} className="text-[#7c6cf0]" />
                <div>
                  <div className="text-sm font-semibold text-[#1e1f2e]">Browse Templates</div>
                  <div className="text-[11px] text-[#8e90a6]">5 pre-built workflows</div>
                </div>
              </Link>
              <Link to="/designer"
                className="flex items-center gap-3 p-3.5 bg-white border border-[#e2e4ef] rounded-xl shadow-sm hover:bg-[#f8f9fc] transition-colors">
                <BarChart3 size={18} className="text-[#4a8ff7]" />
                <div>
                  <div className="text-sm font-semibold text-[#1e1f2e]">Open Designer</div>
                  <div className="text-[11px] text-[#8e90a6]">Visual process builder</div>
                </div>
              </Link>
            </div>

            {/* Node Types Legend */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-[#1e1f2e] mb-3">Node Types</h3>
              <div className="space-y-1.5">
                {[
                  { icon: Play, label: 'Start', desc: 'Entry point', color: '#22a86b', bg: '#f0faf5' },
                  { icon: ClipboardList, label: 'Task', desc: 'Human task', color: '#4a8ff7', bg: '#f0f5ff' },
                  { icon: UserCheck, label: 'Approval', desc: 'Gate check', color: '#e89e1c', bg: '#fef8eb' },
                  { icon: Zap, label: 'Automated', desc: 'System action', color: '#7c6cf0', bg: '#f5f3fe' },
                  { icon: Square, label: 'End', desc: 'Completion', color: '#e04e5e', bg: '#fef0f1' },
                ].map((n) => (
                  <div key={n.label} className="flex items-center gap-2.5 px-3 py-2 rounded-lg"
                       style={{ backgroundColor: n.bg }}>
                    <n.icon size={14} style={{ color: n.color }} />
                    <span className="text-xs font-medium text-[#1e1f2e]">{n.label}</span>
                    <span className="text-[10px] text-[#8e90a6]">— {n.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Workflows */}
          <div className="col-span-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-[#1e1f2e]">Recent Workflows</h3>
              <Link to="/templates" className="text-xs text-[#7c6cf0] font-medium hover:underline flex items-center gap-1">
                View all <ArrowRight size={12} />
              </Link>
            </div>
            <div className="bg-white rounded-xl border border-[#e2e4ef] shadow-sm overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#e2e4ef] bg-[#f8f9fc]">
                    <th className="text-left text-[10px] font-semibold uppercase tracking-wider text-[#8e90a6] px-4 py-2.5">Name</th>
                    <th className="text-left text-[10px] font-semibold uppercase tracking-wider text-[#8e90a6] px-4 py-2.5">Nodes</th>
                    <th className="text-left text-[10px] font-semibold uppercase tracking-wider text-[#8e90a6] px-4 py-2.5">Status</th>
                    <th className="text-left text-[10px] font-semibold uppercase tracking-wider text-[#8e90a6] px-4 py-2.5">Updated</th>
                    <th className="px-4 py-2.5"></th>
                  </tr>
                </thead>
                <tbody>
                  {RECENT.map((r, i) => (
                    <tr key={i}
                        className="border-b border-[#e2e4ef] last:border-0 hover:bg-[#f8f9fc] transition-colors cursor-pointer"
                        onClick={() => openWorkflow(r.template)}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Workflow size={14} className="text-[#7c6cf0]" />
                          <span className="text-sm font-medium text-[#1e1f2e]">{r.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-[#5a5c78]">{r.nodes}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                          r.status === 'active' ? 'bg-[#e7f8f0] text-[#22a86b]' : 'bg-[#f5f6fa] text-[#8e90a6]'
                        }`}>{r.status}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-[#8e90a6]">{r.updated}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-[#7c6cf0] hover:underline font-medium">Open →</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
