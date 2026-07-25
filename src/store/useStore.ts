import { create } from 'zustand';
import { api, connectWS } from '../api/client';
import type { ApiUser, ApiBaseline, ApiAlert, ApiActionLogEntry } from '../api/client';
import type { User, BaselineProfile, Alert, ActionLogEntry } from '../types';

interface SentinelXState {
  users: User[];
  baselines: Map<string, BaselineProfile>;
  alerts: Alert[];
  actionLog: ActionLogEntry[];
  sensitivity: number;
  totalDepartments: number;
  loading: boolean;
  error: string | null;

  fetchAll: () => Promise<void>;
  updateSensitivity: (value: number) => Promise<void>;
  markAlert: (id: string, status: 'confirmed_threat' | 'false_positive') => Promise<void>;
  handleWSMessage: (data: unknown) => void;
}

function mapUser(u: ApiUser): User {
  return { id: u.id, name: u.name, email: u.email, department: u.department, role: u.role, avatarColor: u.avatarColor };
}

function mapBaseline(b: ApiBaseline): BaselineProfile {
  return { userId: b.userId, avgLoginsPerDay: b.avgLoginsPerDay, stdLoginsPerDay: b.stdLoginsPerDay, avgFileAccessPerDay: b.avgFileAccessPerDay, stdFileAccessPerDay: b.stdFileAccessPerDay, avgDataTransferPerDay: b.avgDataTransferPerDay, stdDataTransferPerDay: b.stdDataTransferPerDay, typicalHours: b.typicalHours, hourlyActivity: b.hourlyActivity };
}

function mapAlert(a: ApiAlert): Alert {
  return { id: a.id, userId: a.userId, timestamp: a.timestamp, eventType: a.eventType as Alert['eventType'], riskScore: a.riskScore, severity: a.severity as Alert['severity'], explanation: a.explanation, factors: a.factors, status: a.status as Alert['status'], eventId: a.eventId, eventData: a.eventData as Alert['eventData'] };
}

function mapLogEntry(e: ApiActionLogEntry): ActionLogEntry {
  return { id: e.id, timestamp: e.timestamp, action: e.action, details: e.details, level: e.level as ActionLogEntry['level'] };
}

export const useStore = create<SentinelXState>((set, get) => ({
  users: [],
  baselines: new Map(),
  alerts: [],
  actionLog: [],
  sensitivity: 1.0,
  totalDepartments: 10,
  loading: true,
  error: null,

  fetchAll: async () => {
    try {
      set({ loading: true, error: null });
      const [usersRes, baselinesRes, alertsRes, logRes, sensRes] = await Promise.all([
        api.getUsers(),
        api.getBaselines(),
        api.getAlerts(),
        api.getActionLog(),
        api.getSensitivity(),
      ]);

      const baselines = new Map(Object.entries(baselinesRes.baselines).map(([k, v]) => [k, mapBaseline(v)]));

      set({
        users: usersRes.users.map(mapUser),
        baselines,
        alerts: alertsRes.alerts.map(mapAlert),
        actionLog: logRes.entries.map(mapLogEntry),
        sensitivity: sensRes.sensitivity,
        totalDepartments: usersRes.totalDepartments,
        loading: false,
      });

      connectWS(get().handleWSMessage);
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to load data', loading: false });
    }
  },

  updateSensitivity: async (value: number) => {
    try {
      set({ sensitivity: value });
      await api.setSensitivity(value);
      const [alertsRes, logRes] = await Promise.all([api.getAlerts(), api.getActionLog()]);
      set({
        alerts: alertsRes.alerts.map(mapAlert),
        actionLog: logRes.entries.map(mapLogEntry),
      });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to update sensitivity' });
    }
  },

  markAlert: async (id, status) => {
    try {
      await api.markAlert(id, status);
      const [alertsRes, logRes] = await Promise.all([api.getAlerts(), api.getActionLog()]);
      set({
        alerts: alertsRes.alerts.map(mapAlert),
        actionLog: logRes.entries.map(mapLogEntry),
      });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to mark alert' });
    }
  },

  handleWSMessage: (data: unknown) => {
    const msg = data as { type: string; alert?: ApiAlert; sensitivity?: number };
    if (msg.type === 'alert_update' && msg.alert) {
      set(state => ({
        alerts: state.alerts.map(a => a.id === msg.alert!.id ? mapAlert(msg.alert!) : a),
      }));
    }
    if (msg.type === 'sensitivity' && msg.sensitivity !== undefined) {
      set({ sensitivity: msg.sensitivity! });
    }
  },
}));
