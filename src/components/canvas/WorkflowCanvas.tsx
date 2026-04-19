import React, { useCallback, useRef } from 'react';
import ReactFlow, {
  Background, Controls, MiniMap, type ReactFlowInstance,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useWorkflowStore } from '../../store/workflowStore';
import { nodeTypes } from '../nodes/nodeRegistry';
import { type WorkflowNodeType, NODE_VISUALS } from '../../types';

export const WorkflowCanvas: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const instance = useRef<ReactFlowInstance | null>(null);

  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const onNodesChange = useWorkflowStore((s) => s.onNodesChange);
  const onEdgesChange = useWorkflowStore((s) => s.onEdgesChange);
  const onConnect = useWorkflowStore((s) => s.onConnect);
  const addNode = useWorkflowStore((s) => s.addNode);
  const selectNode = useWorkflowStore((s) => s.selectNode);

  const onInit = useCallback((i: ReactFlowInstance) => { instance.current = i; }, []);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('application/reactflow') as WorkflowNodeType;
    if (!type || !instance.current || !ref.current) return;
    const bounds = ref.current.getBoundingClientRect();
    addNode(type, instance.current.project({ x: e.clientX - bounds.left, y: e.clientY - bounds.top }));
  }, [addNode]);

  const nodeColor = (n: { type?: string }) =>
    NODE_VISUALS[(n.type || 'task') as WorkflowNodeType]?.color || '#8e90a6';

  return (
    <div ref={ref} className="flex-1 h-full" role="application" aria-label="Workflow canvas">
      <ReactFlow
        nodes={nodes} edges={edges}
        onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect}
        onInit={onInit} onDrop={onDrop} onDragOver={onDragOver}
        onNodeClick={(_, n) => selectNode(n.id)}
        onPaneClick={() => selectNode(null)}
        nodeTypes={nodeTypes}
        fitView
        deleteKeyCode={['Backspace', 'Delete']}
        snapToGrid snapGrid={[16, 16]}
        defaultEdgeOptions={{
          animated: true,
          style: { stroke: '#0F3D4C', strokeWidth: 2 },
        }}
        style={{ background: '#f5f6fa' }}
      >
        <Background color="#d0d3e4" gap={24} size={1} />
        <Controls />
        <MiniMap nodeColor={nodeColor} nodeStrokeWidth={2} zoomable pannable />
      </ReactFlow>
    </div>
  );
};
