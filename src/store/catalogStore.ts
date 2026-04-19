import { create } from 'zustand';

export type WorkflowStatus = 'active' | 'completed' | 'draft';

export interface SavedWorkflow {
  id: string;
  name: string;
  template: 'onboarding' | 'leave-approval' | 'doc-verification' | 'exit-process' | 'performance-review';
  nodes: number;
  edges: number;
  status: WorkflowStatus;
  updatedAt: string;
  createdBy: string;
  department: string;
}

const INITIAL_WORKFLOWS: SavedWorkflow[] = [
  // ─── Active (12) ────────────────────────────────────────
  { id: 'wf-001', name: 'Employee Onboarding — Q2 Batch', template: 'onboarding', nodes: 6, edges: 5, status: 'active', updatedAt: '2 hours ago', createdBy: 'Priya Sharma', department: 'HR' },
  { id: 'wf-002', name: 'Annual Leave Request Flow', template: 'leave-approval', nodes: 7, edges: 6, status: 'active', updatedAt: '5 hours ago', createdBy: 'Arjun Mehta', department: 'HR' },
  { id: 'wf-003', name: 'Document Verification — Compliance', template: 'doc-verification', nodes: 5, edges: 4, status: 'active', updatedAt: '1 day ago', createdBy: 'Neha Gupta', department: 'Compliance' },
  { id: 'wf-004', name: 'New Hire IT Setup Workflow', template: 'onboarding', nodes: 6, edges: 5, status: 'active', updatedAt: '1 day ago', createdBy: 'Rahul Verma', department: 'IT' },
  { id: 'wf-005', name: 'Sick Leave Escalation', template: 'leave-approval', nodes: 7, edges: 6, status: 'active', updatedAt: '2 days ago', createdBy: 'Sana Khan', department: 'HR' },
  { id: 'wf-006', name: 'Contractor Onboarding', template: 'onboarding', nodes: 6, edges: 5, status: 'active', updatedAt: '2 days ago', createdBy: 'Vikram Reddy', department: 'Procurement' },
  { id: 'wf-007', name: 'Mid-Year Performance Check', template: 'performance-review', nodes: 7, edges: 6, status: 'active', updatedAt: '3 days ago', createdBy: 'Ananya Das', department: 'HR' },
  { id: 'wf-008', name: 'KYC Document Audit', template: 'doc-verification', nodes: 5, edges: 4, status: 'active', updatedAt: '3 days ago', createdBy: 'Ravi Patel', department: 'Compliance' },
  { id: 'wf-009', name: 'Parental Leave Approval', template: 'leave-approval', nodes: 7, edges: 6, status: 'active', updatedAt: '4 days ago', createdBy: 'Meera Iyer', department: 'HR' },
  { id: 'wf-010', name: 'Intern Exit Checklist', template: 'exit-process', nodes: 8, edges: 7, status: 'active', updatedAt: '5 days ago', createdBy: 'Karan Singh', department: 'HR' },
  { id: 'wf-011', name: 'Vendor Document Verification', template: 'doc-verification', nodes: 5, edges: 4, status: 'active', updatedAt: '5 days ago', createdBy: 'Divya Nair', department: 'Procurement' },
  { id: 'wf-012', name: 'Remote Work Leave Policy', template: 'leave-approval', nodes: 7, edges: 6, status: 'active', updatedAt: '1 week ago', createdBy: 'Amit Joshi', department: 'Operations' },

  // ─── Completed (8) ──────────────────────────────────────
  { id: 'wf-013', name: 'Q1 Onboarding — Engineering', template: 'onboarding', nodes: 6, edges: 5, status: 'completed', updatedAt: '1 week ago', createdBy: 'Priya Sharma', department: 'Engineering' },
  { id: 'wf-014', name: 'Annual Review 2025 — Finance', template: 'performance-review', nodes: 7, edges: 6, status: 'completed', updatedAt: '2 weeks ago', createdBy: 'Ananya Das', department: 'Finance' },
  { id: 'wf-015', name: 'Exit Process — Senior Dev', template: 'exit-process', nodes: 8, edges: 7, status: 'completed', updatedAt: '2 weeks ago', createdBy: 'Karan Singh', department: 'Engineering' },
  { id: 'wf-016', name: 'Background Check — Batch 12', template: 'doc-verification', nodes: 5, edges: 4, status: 'completed', updatedAt: '3 weeks ago', createdBy: 'Neha Gupta', department: 'Compliance' },
  { id: 'wf-017', name: 'Holiday Leave — December', template: 'leave-approval', nodes: 7, edges: 6, status: 'completed', updatedAt: '1 month ago', createdBy: 'Sana Khan', department: 'HR' },
  { id: 'wf-018', name: 'Q4 Performance Calibration', template: 'performance-review', nodes: 7, edges: 6, status: 'completed', updatedAt: '1 month ago', createdBy: 'Vikram Reddy', department: 'HR' },
  { id: 'wf-019', name: 'Intern Onboarding — Summer', template: 'onboarding', nodes: 6, edges: 5, status: 'completed', updatedAt: '2 months ago', createdBy: 'Rahul Verma', department: 'HR' },
  { id: 'wf-020', name: 'Compliance Audit — FY25', template: 'doc-verification', nodes: 5, edges: 4, status: 'completed', updatedAt: '2 months ago', createdBy: 'Ravi Patel', department: 'Compliance' },

  // ─── Drafts (5) ─────────────────────────────────────────
  { id: 'wf-021', name: 'Exit Process — Marketing Team', template: 'exit-process', nodes: 8, edges: 7, status: 'draft', updatedAt: '3 days ago', createdBy: 'Meera Iyer', department: 'Marketing' },
  { id: 'wf-022', name: 'Promotion Approval Flow', template: 'performance-review', nodes: 7, edges: 6, status: 'draft', updatedAt: '4 days ago', createdBy: 'Arjun Mehta', department: 'HR' },
  { id: 'wf-023', name: 'Relocation Request Process', template: 'leave-approval', nodes: 7, edges: 6, status: 'draft', updatedAt: '5 days ago', createdBy: 'Divya Nair', department: 'HR' },
  { id: 'wf-024', name: 'Contract Renewal Verification', template: 'doc-verification', nodes: 5, edges: 4, status: 'draft', updatedAt: '1 week ago', createdBy: 'Amit Joshi', department: 'Legal' },
  { id: 'wf-025', name: 'New Office Onboarding', template: 'onboarding', nodes: 6, edges: 5, status: 'draft', updatedAt: '1 week ago', createdBy: 'Priya Sharma', department: 'Facilities' },
];

interface CatalogState {
  workflows: SavedWorkflow[];
  addWorkflow: (wf: Omit<SavedWorkflow, 'id' | 'updatedAt' | 'createdBy' | 'department'>) => void;
  updateWorkflowStatus: (id: string, status: WorkflowStatus) => void;
  deleteWorkflow: (id: string) => void;
  getStats: () => { active: number; completed: number; drafts: number; total: number };
}

export const useCatalogStore = create<CatalogState>((set, get) => ({
  workflows: INITIAL_WORKFLOWS,
  
  addWorkflow: (wf) => {
    const newWf: SavedWorkflow = {
      ...wf,
      id: `wf-${Math.floor(Math.random() * 10000)}`,
      updatedAt: 'Just now',
      createdBy: 'You (Admin)',
      department: 'HR Operations' // Default
    };
    
    set((state) => ({
      workflows: [newWf, ...state.workflows]
    }));
  },
  
  updateWorkflowStatus: (id, status) => {
    set((state) => ({
      workflows: state.workflows.map(wf => 
        wf.id === id ? { ...wf, status, updatedAt: 'Just now' } : wf
      )
    }));
  },

  deleteWorkflow: (id) => {
    set((state) => ({
      workflows: state.workflows.filter(wf => wf.id !== id)
    }));
  },

  getStats: () => {
    const { workflows } = get();
    return {
      active: workflows.filter((w) => w.status === 'active').length,
      completed: workflows.filter((w) => w.status === 'completed').length,
      drafts: workflows.filter((w) => w.status === 'draft').length,
      total: workflows.length,
    };
  }
}));
