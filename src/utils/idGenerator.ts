let counter = 0;

export function generateId(prefix: string = 'node'): string {
  counter += 1;
  return `${prefix}_${Date.now()}_${counter}`;
}

export function generateEdgeId(source: string, target: string): string {
  return `edge_${source}_${target}`;
}
