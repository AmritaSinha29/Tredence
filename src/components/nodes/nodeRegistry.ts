import { type NodeTypes } from 'reactflow';
import StartNode from './StartNode';
import TaskNode from './TaskNode';
import ApprovalNode from './ApprovalNode';
import AutomatedStepNode from './AutomatedStepNode';
import EndNode from './EndNode';

/**
 * Registry pattern: maps node type strings to React components.
 * To add a new node type, simply add an entry here and create the component.
 */
export const nodeTypes: NodeTypes = {
  start: StartNode,
  task: TaskNode,
  approval: ApprovalNode,
  automated: AutomatedStepNode,
  end: EndNode,
};
