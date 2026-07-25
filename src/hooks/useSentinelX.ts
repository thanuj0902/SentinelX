import { useState, useCallback, useMemo } from 'react';
import { getData, regenerateData, applyFeedback } from '../data/seed';
import type { Alert } from '../types';

const STORAGE_KEY = 'sentinelx_state';

interface PersistedState {
  alerts: Alert[];
  sensitivity: number;
}

function loadPersistedState(): PersistedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return null;
}

function savePersistedState(alerts: Alert[], sensitivity: number) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ alerts, sensitivity }));
  } catch { /* ignore */ }
}

export function useSentinelX() {
  const persisted = loadPersistedState();
  const [sensitivity, setSensitivity] = useState(persisted?.sensitivity ?? 1.0);
  const [data, setData] = useState(() => {
    const base = getData(sensitivity);
    if (persisted?.alerts) {
      return { ...base, alerts: persisted.alerts };
    }
    return base;
  });
  const [alerts, setAlerts] = useState<Alert[]>(() => persisted?.alerts ?? getData(sensitivity).alerts);

  const updateSensitivity = useCallback((value: number) => {
    setSensitivity(value);
    const newData = regenerateData(value);
    setData(newData);
    setAlerts(newData.alerts);
    savePersistedState(newData.alerts, value);
  }, []);

  const markAlert = useCallback((alertId: string, status: 'confirmed_threat' | 'false_positive') => {
    const result = applyFeedback(alertId, status);
    setAlerts(result.alerts);
    setData(prev => ({ ...prev, alerts: result.alerts, actionLog: result.actionLog }));
    savePersistedState(result.alerts, sensitivity);
  }, [sensitivity]);

  const activeAlerts = useMemo(
    () => alerts.filter((a: Alert) => a.status === 'active' || a.status === 'investigating'),
    [alerts]
  );

  const confirmedThreats = useMemo(
    () => alerts.filter((a: Alert) => a.status === 'confirmed_threat'),
    [alerts]
  );

  const falsePositives = useMemo(
    () => alerts.filter((a: Alert) => a.status === 'false_positive'),
    [alerts]
  );

  const falsePositiveRate = useMemo(() => {
    const resolved = confirmedThreats.length + falsePositives.length;
    return resolved > 0 ? Math.round((falsePositives.length / resolved) * 100) : 0;
  }, [confirmedThreats, falsePositives]);

  const alertsByDay = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const dayStr = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayAlerts = alerts.filter((a: Alert) => {
        const ad = new Date(a.timestamp);
        return ad.toDateString() === d.toDateString();
      });
      return {
        day: dayStr,
        critical: dayAlerts.filter((a: Alert) => a.severity === 'critical').length,
        high: dayAlerts.filter((a: Alert) => a.severity === 'high').length,
        medium: dayAlerts.filter((a: Alert) => a.severity === 'medium').length,
        low: dayAlerts.filter((a: Alert) => a.severity === 'low').length,
      };
    });
  }, [alerts]);

  const topRiskUsers = useMemo(() => {
    return [...data.users]
      .map((user) => {
        const userAlerts = alerts.filter((a: Alert) => a.userId === user.id);
        const maxScore = userAlerts.length > 0 ? Math.max(...userAlerts.map((a: Alert) => a.riskScore)) : 0;
        return { user, maxScore, alertCount: userAlerts.length };
      })
      .sort((a, b) => b.maxScore - a.maxScore)
      .slice(0, 5);
  }, [data.users, alerts]);

  return {
    data,
    sensitivity,
    alerts,
    activeAlerts,
    confirmedThreats,
    falsePositives,
    falsePositiveRate,
    alertsByDay,
    topRiskUsers,
    updateSensitivity,
    markAlert,
  };
}
