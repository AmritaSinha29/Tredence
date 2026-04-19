import { type Node, type Edge } from 'reactflow';

// ─── Node Types ───────────────────────────────────────────
export type WorkflowNodeType = 'start' | 'task' | 'approval' | 'automated' | 'condition' | 'end';

// ─── Per-Type Data Interfaces ─────────────────────────────
export interface StartNodeData {
  type: 'start';
  label: string;
  title: string;
  metadata: Record<string, string>;
}

export interface TaskNodeData {
  type: 'task';
  label: string;
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  customFields: Record<string, string>;
}

export interface ApprovalNodeData {
  type: 'approval';
  label: string;
  title: string;
  approverRole: string;
  autoApproveThreshold: number;
}

export interface AutomatedStepNodeData {
  type: 'automated';
  label: string;
  title: string;
  actionId: string;
  actionParams: Record<string, string>;
}

export interface EndNodeData {
  type: 'end';
  label: string;
  endMessage: string;
  showSummary: boolean;
}

export interface ConditionNodeData {
  type: 'condition';
  label: string;
  title: string;
  variable: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains';
  value: string;
}

// ─── Discriminated Union ──────────────────────────────────
export type WorkflowNodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedStepNodeData
  | ConditionNodeData
  | EndNodeData;

// ─── React Flow Node with typed data ──────────────────────
export type WorkflowNode = Node<WorkflowNodeData>;
export type WorkflowEdge = Edge;

// ─── Serialized Workflow ──────────────────────────────────
export interface SerializedWorkflow {
  version: string;
  name: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  createdAt: string;
  updatedAt: string;
}

// ─── Validation ───────────────────────────────────────────
export interface ValidationError {
  nodeId?: string;
  type: 'error' | 'warning';
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

// ─── Node Defaults ────────────────────────────────────────
export const NODE_DEFAULTS: Record<WorkflowNodeType, () => WorkflowNodeData> = {
  start: () => ({
    type: 'start',
    label: 'Start',
    title: 'Workflow Start',
    metadata: {},
  }),
  task: () => ({
    type: 'task',
    label: 'Task',
    title: '',
    description: '',
    assignee: '',
    dueDate: '',
    customFields: {},
  }),
  approval: () => ({
    type: 'approval',
    label: 'Approval',
    title: '',
    approverRole: 'Manager',
    autoApproveThreshold: 0,
  }),
  automated: () => ({
    type: 'automated',
    label: 'Automated Step',
    title: '',
    actionId: '',
    actionParams: {},
  }),
  condition: () => ({
    type: 'condition',
    label: 'Condition',
    title: '',
    variable: '',
    operator: 'equals',
    value: '',
  }),
  end: () => ({
    type: 'end',
    label: 'End',
    endMessage: 'Workflow Complete',
    showSummary: true,
  }),
};

// ─── Node Visual Config ───────────────────────────────────
export interface NodeVisualConfig {
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
  label: string;
}

export const NODE_VISUALS: Record<WorkflowNodeType, NodeVisualConfig> = {
  start: {
    color: '#22a86b',
    bgColor: '#f0faf5',
    borderColor: '#c5e8d8',
    icon: 'Play',
    label: 'Start',
  },
  task: {
    color: '#4a8ff7',
    bgColor: '#f0f5ff',
    borderColor: '#c4d9f8',
    icon: 'ClipboardList',
    label: 'Task',
  },
  approval: {
    color: '#e89e1c',
    bgColor: '#fef8eb',
    borderColor: '#f5dfa0',
    icon: 'UserCheck',
    label: 'Approval',
  },
  automated: {
    color: '#F36633',
    bgColor: '#FFF5F0',
    borderColor: '#FCDCCF',
    icon: 'Zap',
    label: 'Automated',
  },
  condition: {
    color: '#8e90a6',
    bgColor: '#f5f6fa',
    borderColor: '#e2e4ef',
    icon: 'Split',
    label: 'Condition',
  },
  end: {
    color: '#e04e5e',
    bgColor: '#fef0f1',
    borderColor: '#f5c4ca',
    icon: 'Square',
    label: 'End',
  },
};
