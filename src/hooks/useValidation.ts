import { useCallback } from 'react';
import { type WorkflowNode, type WorkflowEdge } from '../types';
import { validateWorkflow } from '../utils/graphValidator';

/**
 * Hook wrapping graph validation logic.
 */
export function useValidation() {
  const validate = useCallback(
    (nodes: WorkflowNode[], edges: WorkflowEdge[]) => {
      return validateWorkflow(nodes, edges);
    },
    []
  );

  return { validate };
}
