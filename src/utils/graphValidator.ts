import { type WorkflowNode, type WorkflowEdge, type ValidationResult, type ValidationError } from '../types';

/**
 * Comprehensive graph validation for workflow structures.
 * Checks: start/end node presence, connectivity, cycles, required fields, edge validity.
 */
export function validateWorkflow(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[]
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  if (nodes.length === 0) {
    errors.push({ type: 'error', message: 'Workflow is empty. Add at least a Start and End node.' });
    return { isValid: false, errors, warnings };
  }

  // 1. Check for exactly one Start node
  const startNodes = nodes.filter((n) => n.data.type === 'start');
  if (startNodes.length === 0) {
    errors.push({ type: 'error', message: 'Workflow must have a Start node.' });
  } else if (startNodes.length > 1) {
    startNodes.forEach((n) =>
      errors.push({ nodeId: n.id, type: 'error', message: 'Only one Start node is allowed.' })
    );
  }

  // 2. Check for at least one End node
  const endNodes = nodes.filter((n) => n.data.type === 'end');
  if (endNodes.length === 0) {
    errors.push({ type: 'error', message: 'Workflow must have at least one End node.' });
  }

  // 3. Start node should have no incoming edges
  startNodes.forEach((sn) => {
    const incoming = edges.filter((e) => e.target === sn.id);
    if (incoming.length > 0) {
      errors.push({
        nodeId: sn.id,
        type: 'error',
        message: 'Start node must not have incoming connections.',
      });
    }
  });

  // 4. End node should have no outgoing edges
  endNodes.forEach((en) => {
    const outgoing = edges.filter((e) => e.source === en.id);
    if (outgoing.length > 0) {
      errors.push({
        nodeId: en.id,
        type: 'error',
        message: 'End node must not have outgoing connections.',
      });
    }
  });

  // 4b. Condition node must have exactly two outgoing edges (true and false)
  nodes.filter((n) => n.data.type === 'condition').forEach((cn) => {
    const outgoingEdges = edges.filter((e) => e.source === cn.id);
    const hasTrue = outgoingEdges.some((e) => e.sourceHandle === 'true');
    const hasFalse = outgoingEdges.some((e) => e.sourceHandle === 'false');
    
    if (!hasTrue || !hasFalse) {
      errors.push({
        nodeId: cn.id,
        type: 'error',
        message: 'Condition node must have both TRUE and FALSE outgoing connections.',
      });
    }
  });

  // 5. Check for disconnected nodes (no edges at all)
  nodes.forEach((node) => {
    const hasEdge = edges.some((e) => e.source === node.id || e.target === node.id);
    if (!hasEdge && nodes.length > 1) {
      errors.push({
        nodeId: node.id,
        type: 'error',
        message: `Node "${node.data.label || node.id}" is disconnected.`,
      });
    }
  });

  // 6. Cycle detection using DFS
  const hasCycle = detectCycle(nodes, edges);
  if (hasCycle) {
    errors.push({ type: 'error', message: 'Workflow contains a cycle. Cycles are not allowed.' });
  }

  // 7. Required field validation
  nodes.forEach((node) => {
    const data = node.data;
    switch (data.type) {
      case 'task':
        if (!data.title.trim()) {
          errors.push({
            nodeId: node.id,
            type: 'error',
            message: 'Task node requires a title.',
          });
        }
        break;
      case 'approval':
        if (!data.title.trim()) {
          warnings.push({
            nodeId: node.id,
            type: 'warning',
            message: 'Approval node is missing a title.',
          });
        }
        break;
      case 'automated':
        if (!data.actionId) {
          warnings.push({
            nodeId: node.id,
            type: 'warning',
            message: 'Automated step has no action selected.',
          });
        }
        break;
      case 'condition':
        if (!data.variable || !data.value) {
          errors.push({
            nodeId: node.id,
            type: 'error',
            message: 'Condition node requires a variable and target value.',
          });
        }
        break;
    }
  });

  // 8. Check reachability from Start to End
  if (startNodes.length === 1 && endNodes.length >= 1) {
    const reachable = getReachableNodes(startNodes[0].id, nodes, edges);
    const unreachableEnd = endNodes.some((en) => !reachable.has(en.id));
    if (unreachableEnd) {
      warnings.push({
        type: 'warning',
        message: 'Not all End nodes are reachable from the Start node.',
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/** DFS-based cycle detection */
function detectCycle(nodes: WorkflowNode[], edges: WorkflowEdge[]): boolean {
  const adjacency = new Map<string, string[]>();
  nodes.forEach((n) => adjacency.set(n.id, []));
  edges.forEach((e) => {
    const list = adjacency.get(e.source);
    if (list) list.push(e.target);
  });

  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  function dfs(nodeId: string): boolean {
    visited.add(nodeId);
    recursionStack.add(nodeId);

    const neighbors = adjacency.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor)) return true;
      } else if (recursionStack.has(neighbor)) {
        return true;
      }
    }

    recursionStack.delete(nodeId);
    return false;
  }

  for (const node of nodes) {
    if (!visited.has(node.id)) {
      if (dfs(node.id)) return true;
    }
  }

  return false;
}

/** BFS to find all reachable nodes from a source */
function getReachableNodes(
  sourceId: string,
  nodes: WorkflowNode[],
  edges: WorkflowEdge[]
): Set<string> {
  const adjacency = new Map<string, string[]>();
  nodes.forEach((n) => adjacency.set(n.id, []));
  edges.forEach((e) => {
    const list = adjacency.get(e.source);
    if (list) list.push(e.target);
  });

  const visited = new Set<string>();
  const queue = [sourceId];
  visited.add(sourceId);

  while (queue.length > 0) {
    const current = queue.shift()!;
    const neighbors = adjacency.get(current) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }

  return visited;
}
