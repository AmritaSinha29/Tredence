// ─── Automation Action (from GET /automations) ───────────
export interface AutomationAction {
  id: string;
  label: string;
  params: string[];
}

// ─── Simulation Types (for POST /simulate) ────────────────
export interface SimulationStep {
  nodeId: string;
  nodeType: string;
  title: string;
  status: 'completed' | 'failed' | 'skipped' | 'pending';
  message: string;
  timestamp: string;
  duration: number; // ms
}

export interface SimulationResult {
  id: string;
  status: 'completed' | 'failed';
  steps: SimulationStep[];
  totalDuration: number;
  errors: string[];
  startedAt: string;
  completedAt: string;
}

// ─── API Response Wrappers ────────────────────────────────
export interface ApiResponse<T> {
  data: T;
  status: number;
  ok: boolean;
}
