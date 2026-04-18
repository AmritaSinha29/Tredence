import { useCallback } from 'react';
import dagre from 'dagre';
import { type WorkflowNode, type WorkflowEdge } from '../types';

const NODE_WIDTH = 220;
const NODE_HEIGHT = 80;

/**
 * Hook for Dagre-based automatic graph layout.
 */
export function useAutoLayout() {
  const getLayoutedElements = useCallback(
    (nodes: WorkflowNode[], edges: WorkflowEdge[], direction: 'TB' | 'LR' = 'TB') => {
      const g = new dagre.graphlib.Graph();
      g.setDefaultEdgeLabel(() => ({}));
      g.setGraph({ rankdir: direction, nodesep: 50, ranksep: 80 });

      nodes.forEach((node) => {
        g.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
      });

      edges.forEach((edge) => {
        g.setEdge(edge.source, edge.target);
      });

      dagre.layout(g);

      const layoutedNodes = nodes.map((node) => {
        const nodeWithPosition = g.node(node.id);
        return {
          ...node,
          position: {
            x: nodeWithPosition.x - NODE_WIDTH / 2,
            y: nodeWithPosition.y - NODE_HEIGHT / 2,
          },
        };
      });

      return { nodes: layoutedNodes, edges };
    },
    []
  );

  return { getLayoutedElements };
}
