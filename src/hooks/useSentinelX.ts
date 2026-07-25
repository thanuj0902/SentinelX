import { useState, useCallback } from 'react';
import { getData, regenerateData } from '../data/seed';
import type { Alert, User, BaselineProfile } from '../types';

export interface SentinelXData {
  users: User[];
  baselines: Map<string, BaselineProfile>;
  alerts: Alert[];
  actionLog: Array<{
    id: string;
    timestamp: string;
    action: string;
    details: string;
    level: 'info' | 'warning' | 'success';
  }>;
}

export function useSentinelX() {
  const [sensitivity, setSensitivity] = useState(1.0);
  const [data, setData] = useState<SentinelXData>(() => getData(1.0));
  const [alerts, setAlerts] = useState<Alert[]>(() => getData(1.0).alerts);

  const updateSensitivity = useCallback((value: number) => {
    setSensitivity(value);
    const newData = regenerateData(value);
    setData(newData);
    setAlerts(newData.alerts);
  }, []);

  const markAlert = useCallback((alertId: string, status: Alert['status']) => {
    setAlerts((prev: Alert[]) => prev.map((a: Alert) => a.id === alertId ? { ...a, status } : a));
  }, []);

  const activeAlerts = alerts.filter((a: Alert) => a.status === 'active' || a.status === 'investigating');
  const confirmedThreats = alerts.filter((a: Alert) => a.status === 'confirmed_threat');
  const falsePositives = alerts.filter((a: Alert) => a.status === 'false_positive');
  const falsePositiveRate = alerts.length > 0
    ? Math.round((falsePositives.length / alerts.length) * 100)
    : 0;

  const alertsByDay = Array.from({ length: 7 }, (_, i) => {
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

  const topRiskUsers = [...data.users]
    .map((user: User) => {
      const userAlerts = alerts.filter((a: Alert) => a.userId === user.id);
      const maxScore = userAlerts.length > 0 ? Math.max(...userAlerts.map((a: Alert) => a.riskScore)) : 0;
      return { user, maxScore, alertCount: userAlerts.length };
    })
    .sort((a, b) => b.maxScore - a.maxScore)
    .slice(0, 5);

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
