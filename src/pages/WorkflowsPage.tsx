import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Workflow, Search, Filter, ArrowRight, Users, Calendar } from 'lucide-react';
import { WORKFLOWS, type WorkflowStatus, type SavedWorkflow } from '../data/workflows';
import { useWorkflowStore } from '../store/workflowStore';

const STATUS_TABS: { key: WorkflowStatus | 'all'; label: string; count: number }[] = [
  { key: 'all', label: 'All', count: WORKFLOWS.length },
  { key: 'active', label: 'Active', count: WORKFLOWS.filter((w) => w.status === 'active').length },
  { key: 'completed', label: 'Completed', count: WORKFLOWS.filter((w) => w.status === 'completed').length },
  { key: 'draft', label: 'Drafts', count: WORKFLOWS.filter((w) => w.status === 'draft').length },
];

const STATUS_STYLES: Record<WorkflowStatus, string> = {
  active: 'bg-[#e7f8f0] text-[#22a86b]',
  completed: 'bg-[#f0f5ff] text-[#4a8ff7]',
  draft: 'bg-[#f5f6fa] text-[#8e90a6]',
};

export const WorkflowsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialFilter = (searchParams.get('status') as WorkflowStatus | 'all') || 'all';

  const [filter, setFilter] = useState<WorkflowStatus | 'all'>(initialFilter);
  const [search, setSearch] = useState('');
  const loadTemplate = useWorkflowStore((s) => s.loadTemplate);

  const filtered = WORKFLOWS.filter((w) => {
    if (filter !== 'all' && w.status !== filter) return false;
    if (search && !w.name.toLowerCase().includes(search.toLowerCase()) &&
        !w.department.toLowerCase().includes(search.toLowerCase()) &&
        !w.createdBy.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const openWorkflow = (wf: SavedWorkflow) => {
    loadTemplate(wf.template);
    navigate('/designer');
  };

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#1e1f2e]">All Workflows</h2>
            <p className="text-sm text-[#8e90a6] mt-1">{WORKFLOWS.length} workflows across your organization</p>
          </div>
          <button onClick={() => navigate('/designer')}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#7c6cf0] hover:bg-[#6354d4] text-white
                       rounded-lg text-sm font-semibold transition-colors shadow-sm">
            + New Workflow
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-5">
          {/* Status Tabs */}
          <div className="flex bg-white rounded-lg border border-[#e2e4ef] p-0.5">
            {STATUS_TABS.map((tab) => (
              <button key={tab.key} onClick={() => setFilter(tab.key)}
                className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  filter === tab.key
                    ? 'bg-[#7c6cf0] text-white shadow-sm'
                    : 'text-[#5a5c78] hover:bg-[#f8f9fc]'
                }`}>
                {tab.label}
                <span className={`ml-1.5 text-[10px] ${filter === tab.key ? 'text-white/70' : 'text-[#b4b6c8]'}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex-1 max-w-xs relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b4b6c8]" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, department, or creator..."
              className="w-full pl-8 pr-3 py-2 text-xs border border-[#e2e4ef] rounded-lg bg-white
                         text-[#1e1f2e] placeholder:text-[#b4b6c8]
                         focus:outline-none focus:border-[#7c6cf0] focus:ring-2 focus:ring-[#ece9fd]" />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-[#e2e4ef] shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e2e4ef] bg-[#f8f9fc]">
                <th className="text-left text-[10px] font-semibold uppercase tracking-wider text-[#8e90a6] px-4 py-3">Workflow</th>
                <th className="text-left text-[10px] font-semibold uppercase tracking-wider text-[#8e90a6] px-4 py-3">Department</th>
                <th className="text-left text-[10px] font-semibold uppercase tracking-wider text-[#8e90a6] px-4 py-3">Created By</th>
                <th className="text-left text-[10px] font-semibold uppercase tracking-wider text-[#8e90a6] px-4 py-3">Nodes</th>
                <th className="text-left text-[10px] font-semibold uppercase tracking-wider text-[#8e90a6] px-4 py-3">Status</th>
                <th className="text-left text-[10px] font-semibold uppercase tracking-wider text-[#8e90a6] px-4 py-3">Updated</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <Filter size={24} className="text-[#d0d3e4] mx-auto mb-2" />
                    <p className="text-sm text-[#8e90a6]">No workflows match your filters</p>
                  </td>
                </tr>
              ) : (
                filtered.map((wf) => (
                  <tr key={wf.id}
                      className="border-b border-[#e2e4ef] last:border-0 hover:bg-[#f8f9fc] transition-colors cursor-pointer group"
                      onClick={() => openWorkflow(wf)}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Workflow size={14} className="text-[#7c6cf0] flex-shrink-0" />
                        <span className="text-sm font-medium text-[#1e1f2e] group-hover:text-[#7c6cf0] transition-colors">
                          {wf.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-[#5a5c78] bg-[#f5f6fa] px-2 py-0.5 rounded-full border border-[#e2e4ef]">
                        {wf.department}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Users size={12} className="text-[#b4b6c8]" />
                        <span className="text-xs text-[#5a5c78]">{wf.createdBy}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#5a5c78] font-medium">{wf.nodes}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${STATUS_STYLES[wf.status]}`}>
                        {wf.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={11} className="text-[#b4b6c8]" />
                        <span className="text-xs text-[#8e90a6]">{wf.updatedAt}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-[#7c6cf0] font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        Open <ArrowRight size={11} />
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <p className="text-[10px] text-[#b4b6c8] text-center mt-3">
          Showing {filtered.length} of {WORKFLOWS.length} workflows
        </p>
      </div>
    </div>
  );
};
