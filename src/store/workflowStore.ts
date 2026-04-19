import { create } from 'zustand';
import {
  type Connection,
  type EdgeChange,
  type NodeChange,
  type XYPosition,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from 'reactflow';
import {
  type WorkflowNode,
  type WorkflowEdge,
  type WorkflowNodeData,
  type WorkflowNodeType,
  type SerializedWorkflow,
  NODE_DEFAULTS,
} from '../types';
import { generateId } from '../utils/idGenerator';

// ─── Snapshot for Undo/Redo ───────────────────────────────
interface Snapshot {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

// ─── Store Interface ──────────────────────────────────────
interface WorkflowState {
  // State
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  selectedNodeId: string | null;
  undoStack: Snapshot[];
  redoStack: Snapshot[];

  // Node actions
  addNode: (type: WorkflowNodeType, position: XYPosition) => void;
  updateNodeData: (id: string, data: Partial<WorkflowNodeData>) => void;
  deleteNode: (id: string) => void;
  selectNode: (id: string | null) => void;

  // React Flow callbacks
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;

  // Undo/Redo
  pushSnapshot: () => void;
  undo: () => void;
  redo: () => void;

  // Serialization
  serialize: (name?: string) => SerializedWorkflow;
  importWorkflow: (workflow: SerializedWorkflow) => void;
  clearWorkflow: () => void;

  // Templates
  loadTemplate: (template: 'onboarding' | 'leave-approval' | 'doc-verification' | 'exit-process' | 'performance-review') => void;

  // Helpers
  getSelectedNode: () => WorkflowNode | undefined;
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  undoStack: [],
  redoStack: [],

  // ─── Add Node ─────────────────────────────────────────
  addNode: (type, position) => {
    const state = get();
    state.pushSnapshot();
    const data = NODE_DEFAULTS[type]();
    const newNode: WorkflowNode = {
      id: generateId(type),
      type,
      position,
      data,
    };
    set({ nodes: [...state.nodes, newNode], redoStack: [] });
  },

  // ─── Update Node Data ────────────────────────────────
  updateNodeData: (id, partialData) => {
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === id
          ? { ...n, data: { ...n.data, ...partialData } as WorkflowNodeData }
          : n
      ),
    }));
  },

  // ─── Delete Node ──────────────────────────────────────
  deleteNode: (id) => {
    const state = get();
    state.pushSnapshot();
    set({
      nodes: state.nodes.filter((n) => n.id !== id),
      edges: state.edges.filter((e) => e.source !== id && e.target !== id),
      selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
      redoStack: [],
    });
  },

  // ─── Select Node ─────────────────────────────────────
  selectNode: (id) => set({ selectedNodeId: id }),

  // ─── React Flow Handlers ─────────────────────────────
  onNodesChange: (changes) => {
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes) as WorkflowNode[],
    }));

    // Track selection changes
    const selectChange = changes.find(
      (c): c is NodeChange & { type: 'select'; id: string; selected: boolean } =>
        c.type === 'select' && (c as { selected?: boolean }).selected === true
    );
    if (selectChange) {
      set({ selectedNodeId: selectChange.id });
    }

    // If a node was removed, update selection
    const removeChanges = changes.filter(
      (c): c is NodeChange & { type: 'remove'; id: string } => c.type === 'remove'
    );
    if (removeChanges.length > 0) {
      const state = get();
      if (state.selectedNodeId && removeChanges.some((c) => c.id === state.selectedNodeId)) {
        set({ selectedNodeId: null });
      }
    }
  },

  onEdgesChange: (changes) => {
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges),
    }));
  },

  onConnect: (connection) => {
    const state = get();
    state.pushSnapshot();
    set((state) => ({
      edges: addEdge(
        {
          ...connection,
          animated: true,
          style: { stroke: '#a78bfa', strokeWidth: 2 },
        },
        state.edges
      ),
      redoStack: [],
    }));
  },

  // ─── Undo/Redo ────────────────────────────────────────
  pushSnapshot: () => {
    const { nodes, edges, undoStack } = get();
    const snapshot: Snapshot = {
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
    };
    set({ undoStack: [...undoStack.slice(-50), snapshot] }); // Keep last 50
  },

  undo: () => {
    const { undoStack, nodes, edges, redoStack } = get();
    if (undoStack.length === 0) return;
    const prev = undoStack[undoStack.length - 1];
    set({
      nodes: prev.nodes,
      edges: prev.edges,
      undoStack: undoStack.slice(0, -1),
      redoStack: [...redoStack, { nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) }],
      selectedNodeId: null,
    });
  },

  redo: () => {
    const { redoStack, nodes, edges, undoStack } = get();
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    set({
      nodes: next.nodes,
      edges: next.edges,
      redoStack: redoStack.slice(0, -1),
      undoStack: [...undoStack, { nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) }],
      selectedNodeId: null,
    });
  },

  // ─── Serialization ───────────────────────────────────
  serialize: (name = 'Untitled Workflow') => {
    const { nodes, edges } = get();
    return {
      version: '1.0.0',
      name,
      nodes,
      edges,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  importWorkflow: (workflow) => {
    const state = get();
    state.pushSnapshot();
    set({
      nodes: workflow.nodes,
      edges: workflow.edges,
      selectedNodeId: null,
      redoStack: [],
    });
  },

  clearWorkflow: () => {
    const state = get();
    state.pushSnapshot();
    set({ nodes: [], edges: [], selectedNodeId: null, redoStack: [] });
  },

  // ─── Templates ────────────────────────────────────────
  loadTemplate: (template) => {
    const state = get();
    state.pushSnapshot();

    if (template === 'onboarding') {
      const nodes: WorkflowNode[] = [
        { id: 'tpl_start', type: 'start', position: { x: 250, y: 0 }, data: { type: 'start', label: 'Start', title: 'Employee Onboarding', metadata: { department: 'HR' } } },
        { id: 'tpl_task1', type: 'task', position: { x: 250, y: 120 }, data: { type: 'task', label: 'Task', title: 'Collect Documents', description: 'Collect ID proof, address proof, and education certificates', assignee: 'HR Coordinator', dueDate: '', customFields: { priority: 'High' } } },
        { id: 'tpl_approval1', type: 'approval', position: { x: 250, y: 240 }, data: { type: 'approval', label: 'Approval', title: 'Manager Approval', approverRole: 'Manager', autoApproveThreshold: 0 } },
        { id: 'tpl_auto1', type: 'automated', position: { x: 250, y: 360 }, data: { type: 'automated', label: 'Automated Step', title: 'Send Welcome Email', actionId: 'send_email', actionParams: { to: 'new_employee', subject: 'Welcome to the team!' } } },
        { id: 'tpl_task2', type: 'task', position: { x: 250, y: 480 }, data: { type: 'task', label: 'Task', title: 'IT Setup', description: 'Set up laptop, email, and access credentials', assignee: 'IT Admin', dueDate: '', customFields: {} } },
        { id: 'tpl_end', type: 'end', position: { x: 250, y: 600 }, data: { type: 'end', label: 'End', endMessage: 'Onboarding Complete!', showSummary: true } },
      ];
      const edges: WorkflowEdge[] = [
        { id: 'tpl_e1', source: 'tpl_start', target: 'tpl_task1', animated: true, style: { stroke: '#a78bfa', strokeWidth: 2 } },
        { id: 'tpl_e2', source: 'tpl_task1', target: 'tpl_approval1', animated: true, style: { stroke: '#a78bfa', strokeWidth: 2 } },
        { id: 'tpl_e3', source: 'tpl_approval1', target: 'tpl_auto1', animated: true, style: { stroke: '#a78bfa', strokeWidth: 2 } },
        { id: 'tpl_e4', source: 'tpl_auto1', target: 'tpl_task2', animated: true, style: { stroke: '#a78bfa', strokeWidth: 2 } },
        { id: 'tpl_e5', source: 'tpl_task2', target: 'tpl_end', animated: true, style: { stroke: '#a78bfa', strokeWidth: 2 } },
      ];
      set({ nodes, edges, selectedNodeId: null, redoStack: [] });
    }

    if (template === 'leave-approval') {
      const nodes: WorkflowNode[] = [
        { id: 'la_start', type: 'start', position: { x: 250, y: 0 }, data: { type: 'start', label: 'Start', title: 'Leave Request', metadata: { type: 'leave' } } },
        { id: 'la_task1', type: 'task', position: { x: 250, y: 120 }, data: { type: 'task', label: 'Task', title: 'Submit Leave Application', description: 'Employee fills in leave dates, type, and reason', assignee: 'Employee', dueDate: '', customFields: { leaveType: 'Casual' } } },
        { id: 'la_approval1', type: 'approval', position: { x: 250, y: 240 }, data: { type: 'approval', label: 'Approval', title: 'Manager Review', approverRole: 'Manager', autoApproveThreshold: 2 } },
        { id: 'la_approval2', type: 'approval', position: { x: 250, y: 360 }, data: { type: 'approval', label: 'Approval', title: 'HR Verification', approverRole: 'HRBP', autoApproveThreshold: 0 } },
        { id: 'la_auto1', type: 'automated', position: { x: 250, y: 480 }, data: { type: 'automated', label: 'Automated Step', title: 'Update Leave Balance', actionId: 'update_record', actionParams: { employeeId: 'self', field: 'leaveBalance', value: '-1' } } },
        { id: 'la_auto2', type: 'automated', position: { x: 250, y: 600 }, data: { type: 'automated', label: 'Automated Step', title: 'Notify Team', actionId: 'send_slack', actionParams: { channel: '#team', message: 'Leave approved' } } },
        { id: 'la_end', type: 'end', position: { x: 250, y: 720 }, data: { type: 'end', label: 'End', endMessage: 'Leave Processed', showSummary: true } },
      ];
      const edges: WorkflowEdge[] = [
        { id: 'la_e1', source: 'la_start', target: 'la_task1', animated: true, style: { stroke: '#a78bfa', strokeWidth: 2 } },
        { id: 'la_e2', source: 'la_task1', target: 'la_approval1', animated: true, style: { stroke: '#a78bfa', strokeWidth: 2 } },
        { id: 'la_e3', source: 'la_approval1', target: 'la_approval2', animated: true, style: { stroke: '#a78bfa', strokeWidth: 2 } },
        { id: 'la_e4', source: 'la_approval2', target: 'la_auto1', animated: true, style: { stroke: '#a78bfa', strokeWidth: 2 } },
        { id: 'la_e5', source: 'la_auto1', target: 'la_auto2', animated: true, style: { stroke: '#a78bfa', strokeWidth: 2 } },
        { id: 'la_e6', source: 'la_auto2', target: 'la_end', animated: true, style: { stroke: '#a78bfa', strokeWidth: 2 } },
      ];
      set({ nodes, edges, selectedNodeId: null, redoStack: [] });
    }

    if (template === 'doc-verification') {
      const edgeStyle = { stroke: '#7c6cf0', strokeWidth: 2 };
      const nodes: WorkflowNode[] = [
        { id: 'dv_start', type: 'start', position: { x: 250, y: 0 }, data: { type: 'start', label: 'Start', title: 'Document Verification', metadata: { process: 'compliance' } } },
        { id: 'dv_auto1', type: 'automated', position: { x: 250, y: 120 }, data: { type: 'automated', label: 'Automated Step', title: 'OCR Scan', actionId: 'generate_report', actionParams: { format: 'pdf' } } },
        { id: 'dv_task1', type: 'task', position: { x: 250, y: 240 }, data: { type: 'task', label: 'Task', title: 'Manual Review', description: 'Review flagged documents', assignee: 'Compliance Officer', dueDate: '', customFields: {} } },
        { id: 'dv_approval1', type: 'approval', position: { x: 250, y: 360 }, data: { type: 'approval', label: 'Approval', title: 'Compliance Sign-off', approverRole: 'Director', autoApproveThreshold: 0 } },
        { id: 'dv_end', type: 'end', position: { x: 250, y: 480 }, data: { type: 'end', label: 'End', endMessage: 'Verification Complete', showSummary: true } },
      ];
      const edges: WorkflowEdge[] = [
        { id: 'dv_e1', source: 'dv_start', target: 'dv_auto1', animated: true, style: edgeStyle },
        { id: 'dv_e2', source: 'dv_auto1', target: 'dv_task1', animated: true, style: edgeStyle },
        { id: 'dv_e3', source: 'dv_task1', target: 'dv_approval1', animated: true, style: edgeStyle },
        { id: 'dv_e4', source: 'dv_approval1', target: 'dv_end', animated: true, style: edgeStyle },
      ];
      set({ nodes, edges, selectedNodeId: null, redoStack: [] });
    }

    if (template === 'exit-process') {
      const edgeStyle = { stroke: '#7c6cf0', strokeWidth: 2 };
      const nodes: WorkflowNode[] = [
        { id: 'ex_start', type: 'start', position: { x: 250, y: 0 }, data: { type: 'start', label: 'Start', title: 'Exit Process', metadata: { type: 'offboarding' } } },
        { id: 'ex_task1', type: 'task', position: { x: 250, y: 120 }, data: { type: 'task', label: 'Task', title: 'Asset Return', description: 'Return laptop, ID card, and access keys', assignee: 'IT Admin', dueDate: '', customFields: {} } },
        { id: 'ex_task2', type: 'task', position: { x: 250, y: 240 }, data: { type: 'task', label: 'Task', title: 'Knowledge Transfer', description: 'Document ongoing projects and hand over', assignee: 'Team Lead', dueDate: '', customFields: {} } },
        { id: 'ex_task3', type: 'task', position: { x: 250, y: 360 }, data: { type: 'task', label: 'Task', title: 'Exit Interview', description: 'Conduct exit interview', assignee: 'HRBP', dueDate: '', customFields: {} } },
        { id: 'ex_approval1', type: 'approval', position: { x: 250, y: 480 }, data: { type: 'approval', label: 'Approval', title: 'HR Sign-off', approverRole: 'HRBP', autoApproveThreshold: 0 } },
        { id: 'ex_auto1', type: 'automated', position: { x: 250, y: 600 }, data: { type: 'automated', label: 'Automated Step', title: 'Final Settlement', actionId: 'update_record', actionParams: { type: 'settlement' } } },
        { id: 'ex_auto2', type: 'automated', position: { x: 250, y: 720 }, data: { type: 'automated', label: 'Automated Step', title: 'Revoke Access', actionId: 'send_email', actionParams: { to: 'IT', subject: 'Revoke access' } } },
        { id: 'ex_end', type: 'end', position: { x: 250, y: 840 }, data: { type: 'end', label: 'End', endMessage: 'Exit Complete', showSummary: true } },
      ];
      const edges: WorkflowEdge[] = [
        { id: 'ex_e1', source: 'ex_start', target: 'ex_task1', animated: true, style: edgeStyle },
        { id: 'ex_e2', source: 'ex_task1', target: 'ex_task2', animated: true, style: edgeStyle },
        { id: 'ex_e3', source: 'ex_task2', target: 'ex_task3', animated: true, style: edgeStyle },
        { id: 'ex_e4', source: 'ex_task3', target: 'ex_approval1', animated: true, style: edgeStyle },
        { id: 'ex_e5', source: 'ex_approval1', target: 'ex_auto1', animated: true, style: edgeStyle },
        { id: 'ex_e6', source: 'ex_auto1', target: 'ex_auto2', animated: true, style: edgeStyle },
        { id: 'ex_e7', source: 'ex_auto2', target: 'ex_end', animated: true, style: edgeStyle },
      ];
      set({ nodes, edges, selectedNodeId: null, redoStack: [] });
    }

    if (template === 'performance-review') {
      const edgeStyle = { stroke: '#7c6cf0', strokeWidth: 2 };
      const nodes: WorkflowNode[] = [
        { id: 'pr_start', type: 'start', position: { x: 250, y: 0 }, data: { type: 'start', label: 'Start', title: 'Performance Review', metadata: { cycle: 'Annual' } } },
        { id: 'pr_task1', type: 'task', position: { x: 250, y: 120 }, data: { type: 'task', label: 'Task', title: 'Self Assessment', description: 'Employee fills self-evaluation form', assignee: 'Employee', dueDate: '', customFields: {} } },
        { id: 'pr_task2', type: 'task', position: { x: 250, y: 240 }, data: { type: 'task', label: 'Task', title: 'Peer Feedback', description: 'Collect 360-degree feedback from peers', assignee: 'Peers', dueDate: '', customFields: {} } },
        { id: 'pr_approval1', type: 'approval', position: { x: 250, y: 360 }, data: { type: 'approval', label: 'Approval', title: 'Manager Rating', approverRole: 'Manager', autoApproveThreshold: 0 } },
        { id: 'pr_approval2', type: 'approval', position: { x: 250, y: 480 }, data: { type: 'approval', label: 'Approval', title: 'Calibration', approverRole: 'Director', autoApproveThreshold: 0 } },
        { id: 'pr_auto1', type: 'automated', position: { x: 250, y: 600 }, data: { type: 'automated', label: 'Automated Step', title: 'Generate Report', actionId: 'generate_report', actionParams: { format: 'pdf' } } },
        { id: 'pr_end', type: 'end', position: { x: 250, y: 720 }, data: { type: 'end', label: 'End', endMessage: 'Review Finalized', showSummary: true } },
      ];
      const edges: WorkflowEdge[] = [
        { id: 'pr_e1', source: 'pr_start', target: 'pr_task1', animated: true, style: edgeStyle },
        { id: 'pr_e2', source: 'pr_task1', target: 'pr_task2', animated: true, style: edgeStyle },
        { id: 'pr_e3', source: 'pr_task2', target: 'pr_approval1', animated: true, style: edgeStyle },
        { id: 'pr_e4', source: 'pr_approval1', target: 'pr_approval2', animated: true, style: edgeStyle },
        { id: 'pr_e5', source: 'pr_approval2', target: 'pr_auto1', animated: true, style: edgeStyle },
        { id: 'pr_e6', source: 'pr_auto1', target: 'pr_end', animated: true, style: edgeStyle },
      ];
      set({ nodes, edges, selectedNodeId: null, redoStack: [] });
    }
  },

  // ─── Helpers ──────────────────────────────────────────
  getSelectedNode: () => {
    const { nodes, selectedNodeId } = get();
    return nodes.find((n) => n.id === selectedNodeId);
  },
}));
