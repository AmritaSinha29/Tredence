import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, Users, CalendarDays, FileCheck, LogOut, Award, Laptop,
} from 'lucide-react';
import { useWorkflowStore } from '../store/workflowStore';

type TemplateId = 'onboarding' | 'leave-approval' | 'doc-verification' | 'exit-process' | 'performance-review' | 'equipment-request';

interface Template {
  id: TemplateId;
  name: string;
  description: string;
  icon: React.ReactNode;
  iconColor: string;
  iconBg: string;
  nodes: number;
  edges: number;
  tags: string[];
  steps: string[];
}

const TEMPLATES: Template[] = [
  {
    id: 'onboarding',
    name: 'Employee Onboarding',
    description: 'Complete new hire workflow covering document collection, manager approval, IT setup, and welcome communications.',
    icon: <Users size={22} />,
    iconColor: '#22a86b', iconBg: '#e7f8f0',
    nodes: 6, edges: 5,
    tags: ['HR', 'Onboarding', 'New Hire'],
    steps: ['Collect Documents', 'Manager Approval', 'Send Welcome Email', 'IT Setup', 'Complete'],
  },
  {
    id: 'leave-approval',
    name: 'Leave Approval',
    description: 'Multi-level leave request flow with manager review, HR verification, automatic balance update, and team notification.',
    icon: <CalendarDays size={22} />,
    iconColor: '#4a8ff7', iconBg: '#f0f5ff',
    nodes: 7, edges: 6,
    tags: ['HR', 'Leave', 'Approval'],
    steps: ['Submit Application', 'Manager Review', 'HR Verification', 'Update Balance', 'Notify Team', 'Complete'],
  },
];

const MORE_TEMPLATES: Template[] = [
  {
    id: 'doc-verification',
    name: 'Document Verification',
    description: 'Automated document authenticity checks with OCR processing and compliance validation.',
    icon: <FileCheck size={22} />,
    iconColor: '#e89e1c', iconBg: '#fef8eb',
    nodes: 5, edges: 4,
    tags: ['Compliance', 'Documents'],
    steps: ['OCR Scan', 'Manual Review', 'Compliance Sign-off', 'Complete'],
  },
  {
    id: 'exit-process',
    name: 'Exit Process',
    description: 'Structured offboarding covering asset return, knowledge transfer, exit interviews, and final settlements.',
    icon: <LogOut size={22} />,
    iconColor: '#e04e5e', iconBg: '#fef0f1',
    nodes: 8, edges: 7,
    tags: ['HR', 'Offboarding'],
    steps: ['Asset Return', 'Knowledge Transfer', 'Exit Interview', 'HR Sign-off', 'Settlement', 'Complete'],
  },
  {
    id: 'performance-review',
    name: 'Performance Review',
    description: 'Annual performance cycle with self-assessment, peer feedback, calibration, and rating finalization.',
    icon: <Award size={22} />,
    iconColor: '#0F3D4C', iconBg: '#F2F6F8',
    nodes: 7, edges: 6,
    tags: ['HR', 'Performance'],
    steps: ['Self Assessment', 'Peer Feedback', 'Manager Rating', 'Calibration', 'Generate Report', 'Complete'],
  },
  {
    id: 'equipment-request',
    name: 'Remote Equipment Request',
    description: 'IT provisioning flow with conditional logic to ship to remote workers or prepare for office pickup.',
    icon: <Laptop size={22} />,
    iconColor: '#8e90a6', iconBg: '#f5f6fa',
    nodes: 7, edges: 6,
    tags: ['IT', 'Equipment', 'Conditional'],
    steps: ['Request', 'Approval', 'Check Location', 'Ship / Pickup', 'Complete'],
  },
];

export const TemplatesPage: React.FC = () => {
  const navigate = useNavigate();
  const loadTemplate = useWorkflowStore((s) => s.loadTemplate);

  const handleUse = (id: TemplateId) => {
    loadTemplate(id);
    navigate('/designer');
  };

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#1e1f2e]">Workflow Templates</h2>
          <p className="text-sm text-[#8e90a6] mt-1">
            Start with a pre-built template or create from scratch.
          </p>
        </div>

        {/* Active Templates */}
        <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-[#8e90a6] mb-3">
          Ready to Use
        </h3>
        <div className="grid grid-cols-2 gap-5 mb-10">
          {TEMPLATES.map((t) => (
            <div key={t.id} className="bg-white rounded-md border border-[#e2e4ef] shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-5">
                <div className="flex items-start gap-3.5 mb-3">
                  <div className="w-11 h-11 rounded-md flex items-center justify-center flex-shrink-0"
                       style={{ backgroundColor: t.iconBg, color: t.iconColor }}>
                    {t.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-bold text-[#1e1f2e]">{t.name}</h4>
                    <div className="flex gap-1.5 mt-1">
                      {t.tags.map((tag) => (
                        <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#f5f6fa] text-[#8e90a6] border border-[#e2e4ef]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-[#5a5c78] leading-relaxed mb-4">{t.description}</p>

                {/* Steps preview */}
                <div className="flex items-center gap-1 mb-4 flex-wrap">
                  {t.steps.map((step, i) => (
                    <React.Fragment key={step}>
                      <span className="text-[10px] font-medium text-[#5a5c78] bg-[#f8f9fc] px-2 py-0.5 rounded-md border border-[#e2e4ef]">
                        {step}
                      </span>
                      {i < t.steps.length - 1 && <ArrowRight size={10} className="text-[#d0d3e4]" />}
                    </React.Fragment>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#b4b6c8]">{t.nodes} nodes · {t.edges} connections</span>
                  <button onClick={() => handleUse(t.id)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#0F3D4C] text-white rounded-md text-xs font-semibold
                               hover:bg-[#0A2B36] transition-colors shadow-sm">
                    Use Template <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* More Templates */}
        <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-[#8e90a6] mb-3">
          More Templates
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {MORE_TEMPLATES.map((t) => (
            <div key={t.id} className="bg-white rounded-md border border-[#e2e4ef] shadow-sm p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-md flex items-center justify-center"
                     style={{ backgroundColor: t.iconBg, color: t.iconColor }}>
                  {t.icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1e1f2e]">{t.name}</h4>
                  <div className="flex gap-1 mt-0.5">
                    {t.tags.map((tag) => (
                      <span key={tag} className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-[#f5f6fa] text-[#8e90a6]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-[#5a5c78] leading-relaxed mb-3">{t.description}</p>
              <div className="flex items-center gap-1 mb-3 flex-wrap">
                {t.steps.map((step, i) => (
                  <React.Fragment key={step}>
                    <span className="text-[9px] font-medium text-[#5a5c78] bg-[#f8f9fc] px-1.5 py-0.5 rounded border border-[#e2e4ef]">{step}</span>
                    {i < t.steps.length - 1 && <ArrowRight size={8} className="text-[#d0d3e4]" />}
                  </React.Fragment>
                ))}
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-[#e2e4ef]">
                <span className="text-[10px] text-[#b4b6c8]">{t.nodes} nodes</span>
                <button onClick={() => handleUse(t.id)}
                  className="text-xs text-[#0F3D4C] font-medium hover:underline flex items-center gap-1">
                  Use Template <ArrowRight size={11} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
