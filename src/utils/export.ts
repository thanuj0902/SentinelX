import type { Alert, User } from '../types';

export function exportAlertsToCSV(alerts: Alert[], users: User[]) {
  const userMap = new Map(users.map(u => [u.id, u]));
  const headers = ['ID', 'User', 'Department', 'Event Type', 'Risk Score', 'Severity', 'Status', 'Explanation', 'Timestamp'];

  const rows = alerts.map(alert => {
    const user = userMap.get(alert.userId);
    return [
      alert.id,
      user?.name || 'Unknown',
      user?.department || 'Unknown',
      alert.eventType.replace('_', ' '),
      alert.riskScore,
      alert.severity,
      alert.status.replace('_', ' '),
      `"${alert.explanation.replace(/"/g, '""')}"`,
      new Date(alert.timestamp).toLocaleString(),
    ];
  });

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `sentinelx-alerts-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
