import { type WorkflowNode, type WorkflowEdge, type SerializedWorkflow } from '../types';

/**
 * Serialize the current workflow state to a JSON-exportable object.
 */
export function serializeWorkflow(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
  name: string = 'Untitled Workflow'
): SerializedWorkflow {
  return {
    version: '1.0.0',
    name,
    nodes: nodes.map((n) => ({
      ...n,
      selected: false,
      dragging: false,
    })),
    edges: edges.map((e) => ({
      ...e,
      selected: false,
    })),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Download a workflow as a JSON file.
 */
export function exportWorkflowToFile(workflow: SerializedWorkflow): void {
  const json = JSON.stringify(workflow, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${workflow.name.replace(/\s+/g, '_').toLowerCase()}_workflow.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Import a workflow from a JSON file. Returns null if invalid.
 */
export function importWorkflowFromFile(file: File): Promise<SerializedWorkflow | null> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data && data.version && Array.isArray(data.nodes) && Array.isArray(data.edges)) {
          resolve(data as SerializedWorkflow);
        } else {
          resolve(null);
        }
      } catch {
        resolve(null);
      }
    };
    reader.onerror = () => resolve(null);
    reader.readAsText(file);
  });
}
