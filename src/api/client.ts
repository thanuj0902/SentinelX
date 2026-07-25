const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);
  return res.json();
}

export interface ApiUser { id: string; name: string; email: string; department: string; role: string; avatarColor: string; }
export interface ApiBaseline { userId: string; avgLoginsPerDay: number; stdLoginsPerDay: number; avgFileAccessPerDay: number; stdFileAccessPerDay: number; avgDataTransferPerDay: number; stdDataTransferPerDay: number; typicalHours: number[]; hourlyActivity: number[]; }
export interface ApiAlert { id: string; userId: string; timestamp: string; eventType: string; riskScore: number; severity: string; explanation: string; factors: { name: string; score: number; description: string; weight: number }[]; status: string; eventId: string; eventData?: Record<string, unknown>; }
export interface ApiActionLogEntry { id: string; timestamp: string; action: string; details: string; level: string; }
export interface ApiStats { totalUsers: number; activeAlerts: number; confirmedThreats: number; falsePositives: number; fpRate: number; criticalCount: number; highCount: number; }

export const api = {
  getUsers: () => request<{ users: ApiUser[]; totalDepartments: number }>('/api/users'),
  getBaselines: () => request<{ baselines: Record<string, ApiBaseline> }>('/api/baselines'),
  getAlerts: () => request<{ alerts: ApiAlert[] }>('/api/alerts'),
  getActionLog: () => request<{ entries: ApiActionLogEntry[] }>('/api/action-log'),
  getStats: () => request<ApiStats>('/api/stats'),
  getSensitivity: () => request<{ sensitivity: number }>('/api/sensitivity'),
  setSensitivity: (sensitivity: number) => request<{ ok: boolean }>('/api/sensitivity', { method: 'POST', body: JSON.stringify({ sensitivity }) }),
  markAlert: (id: string, status: 'confirmed_threat' | 'false_positive') => request<{ ok: boolean }>(`/api/alerts/${id}/mark`, { method: 'POST', body: JSON.stringify({ status }) }),
};

let ws: WebSocket | null = null;
let wsListeners: Array<(data: unknown) => void> = [];

export function connectWS(onMessage?: (data: unknown) => void) {
  if (onMessage) wsListeners.push(onMessage);
  if (ws && ws.readyState === WebSocket.OPEN) return ws;

  const wsUrl = API_BASE.replace('http', 'ws');
  ws = new WebSocket(wsUrl);

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      wsListeners.forEach(fn => fn(data));
    } catch { /* ignore */ }
  };

  ws.onclose = () => {
    ws = null;
    setTimeout(() => connectWS(), 3000);
  };

  return ws;
}

export function disconnectWS() {
  wsListeners = [];
  if (ws) { ws.close(); ws = null; }
}
