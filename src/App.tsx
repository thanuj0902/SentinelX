import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useStore } from './store/useStore';
import LandingPage from './pages/LandingPage';
import DashboardLayout from './pages/DashboardLayout';
import Overview from './pages/Overview';
import AlertsPage from './pages/Alerts';
import AlertDetail from './pages/AlertDetail';
import FalsePositives from './pages/FalsePositives';
import ActionLog from './pages/ActionLog';
import ExplainPage from './pages/ExplainPage';
import SkeletonCard from './components/Skeleton';

function DashboardRoutes() {
  const { users, baselines, alerts, actionLog, sensitivity, totalDepartments, loading, error, fetchAll, updateSensitivity, markAlert } = useStore();

  useEffect(() => { fetchAll(); }, [fetchAll]);

  if (loading) {
    return (
      <DashboardLayout userCount={0}>
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
          <SkeletonCard />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout userCount={0}>
        <div className="text-center py-20">
          <p className="text-red-400 text-sm mb-4">{error}</p>
          <button onClick={() => fetchAll()} className="text-cyan-400 text-sm hover:underline">Retry</button>
        </div>
      </DashboardLayout>
    );
  }

  const activeAlerts = alerts.filter(a => a.status === 'active' || a.status === 'investigating');
  const alertsByDay = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayStr = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayAlerts = alerts.filter(a => new Date(a.timestamp).toDateString() === d.toDateString());
    return { day: dayStr, critical: dayAlerts.filter(a => a.severity === 'critical').length, high: dayAlerts.filter(a => a.severity === 'high').length, medium: dayAlerts.filter(a => a.severity === 'medium').length, low: dayAlerts.filter(a => a.severity === 'low').length };
  });
  const topRiskUsers = [...users].map(user => {
    const userAlerts = alerts.filter(a => a.userId === user.id);
    const maxScore = userAlerts.length > 0 ? Math.max(...userAlerts.map(a => a.riskScore)) : 0;
    return { user, maxScore, alertCount: userAlerts.length };
  }).sort((a, b) => b.maxScore - a.maxScore).slice(0, 5);

  return (
    <DashboardLayout userCount={users.length}>
      <Routes>
        <Route index element={<Overview data={{ users, alerts, baselines, totalDepartments }} activeAlerts={activeAlerts} alertsByDay={alertsByDay} topRiskUsers={topRiskUsers} sensitivity={sensitivity} />} />
        <Route path="alerts" element={<AlertsPage alerts={alerts} users={users} sensitivity={sensitivity} onSensitivityChange={updateSensitivity} />} />
        <Route path="alerts/:alertId" element={<AlertDetail alerts={alerts} users={users} baselines={baselines} onMarkAlert={markAlert} />} />
        <Route path="explain" element={<ExplainPage alerts={alerts} users={users} />} />
        <Route path="false-positives" element={<FalsePositives alerts={alerts} users={users} onMarkAlert={markAlert} />} />
        <Route path="action-log" element={<ActionLog entries={actionLog} />} />
      </Routes>
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard/*" element={<DashboardRoutes />} />
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}
