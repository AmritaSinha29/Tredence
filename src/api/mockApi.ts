import { type AutomationAction, type SimulationResult, type SimulationStep } from '../types';

// ─── Mock Automation Actions ──────────────────────────────
const MOCK_AUTOMATIONS: AutomationAction[] = [
  { id: 'send_email', label: 'Send Email', params: ['to', 'subject'] },
  { id: 'generate_doc', label: 'Generate Document', params: ['template', 'recipient'] },
  { id: 'update_record', label: 'Update HR Record', params: ['employeeId', 'field', 'value'] },
  { id: 'send_slack', label: 'Send Slack Notification', params: ['channel', 'message'] },
  { id: 'schedule_meeting', label: 'Schedule Meeting', params: ['attendees', 'date', 'duration'] },
  { id: 'generate_pdf', label: 'Generate PDF Report', params: ['reportType', 'format'] },
  { id: 'create_ticket', label: 'Create IT Ticket', params: ['title', 'priority', 'assignee'] },
];

// ─── GET /api/automations ─────────────────────────────────
export async function fetchAutomations(): Promise<AutomationAction[]> {
  // Simulate network latency
  await new Promise((r) => setTimeout(r, 300));
  return MOCK_AUTOMATIONS;
}

// ─── POST /api/simulate ───────────────────────────────────
export async function simulateWorkflow(workflow: {
  nodes: Array<{ id: string; type?: string; data: any }>;
  edges: Array<{ source: string; target: string; sourceHandle?: string | null }>;
}): Promise<SimulationResult> {
  // Simulate network latency
  await new Promise((r) => setTimeout(r, 800));

  const { nodes, edges } = workflow;
  const steps: SimulationStep[] = [];
  const startTime = Date.now();

  // Build adjacency for traversal
  const adjacency = new Map<string, Array<{ target: string; handle: string | null }>>();
  nodes.forEach((n) => adjacency.set(n.id, []));
  edges.forEach((e) => {
    const list = adjacency.get(e.source);
    if (list) list.push({ target: e.target, handle: e.sourceHandle || null });
  });

  // Find start node
  const startNode = nodes.find((n) => n.data.type === 'start');
  if (!startNode) {
    return {
      id: `sim_${Date.now()}`,
      status: 'failed',
      steps: [],
      totalDuration: 0,
      errors: ['No Start node found'],
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };
  }

  // BFS traversal
  const visited = new Set<string>();
  const queue: string[] = [startNode.id];
  let stepIndex = 0;

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    if (visited.has(currentId)) continue;
    visited.add(currentId);

    const node = nodes.find((n) => n.id === currentId);
    if (!node) continue;

    const duration = Math.floor(Math.random() * 500) + 100;
    const step: SimulationStep = {
      nodeId: node.id,
      nodeType: node.data.type,
      title: node.data.title || node.data.label || `Step ${stepIndex + 1}`,
      status: 'completed',
      message: getStepMessage(node.data),
      timestamp: new Date(startTime + stepIndex * 1000).toISOString(),
      duration,
    };

    // Simulate random failures for approval nodes
    if (node.data.type === 'approval' && Math.random() < 0.1) {
      step.status = 'failed';
      step.message = `Approval rejected by ${node.data.approverRole || 'approver'}`;
      steps.push(step);
      return {
        id: `sim_${Date.now()}`,
        status: 'failed',
        steps,
        totalDuration: steps.reduce((acc, s) => acc + s.duration, 0),
        errors: [step.message],
        startedAt: new Date(startTime).toISOString(),
        completedAt: new Date().toISOString(),
      };
    }

    steps.push(step);
    stepIndex++;

    // Handle Conditional Branching
    if (node.data.type === 'condition') {
      const isTrue = Math.random() > 0.5; // Simulate 50/50 split
      step.message = `Condition "${node.data.variable} ${node.data.operator} ${node.data.value}" evaluated to ${isTrue ? 'TRUE' : 'FALSE'}`;
      
      const neighbors = adjacency.get(currentId) || [];
      const chosenBranch = neighbors.find((n) => n.handle === (isTrue ? 'true' : 'false'));
      
      if (chosenBranch && !visited.has(chosenBranch.target)) {
        queue.push(chosenBranch.target);
      }
    } else {
      // Normal node: enqueue all neighbors
      const neighbors = adjacency.get(currentId) || [];
      neighbors.forEach((n) => {
        if (!visited.has(n.target)) queue.push(n.target);
      });
    }
  }

  return {
    id: `sim_${Date.now()}`,
    status: 'completed',
    steps,
    totalDuration: steps.reduce((acc, s) => acc + s.duration, 0),
    errors: [],
    startedAt: new Date(startTime).toISOString(),
    completedAt: new Date().toISOString(),
  };
}

function getStepMessage(data: { type: string; title?: string; actionId?: string; approverRole?: string; endMessage?: string; showSummary?: boolean }): string {
  switch (data.type) {
    case 'start':
      return `Workflow initiated: "${data.title || 'Start'}"`;
    case 'task':
      return `Task "${data.title}" assigned and completed`;
    case 'approval':
      return `Approved by ${data.approverRole || 'approver'}`;
    case 'automated':
      return `Automation "${data.actionId || 'action'}" executed successfully`;
    case 'condition':
      return `Condition evaluated`;
    case 'end':
      return data.endMessage || 'Workflow completed';
    default:
      return 'Step executed';
  }
}
