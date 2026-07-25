import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DashboardLayout from './pages/DashboardLayout';
import Overview from './pages/Overview';
import AlertsPage from './pages/Alerts';
import AlertDetail from './pages/AlertDetail';
import FalsePositives from './pages/FalsePositives';
import ActionLog from './pages/ActionLog';
import ExplainPage from './pages/ExplainPage';
import { useSentinelX } from './hooks/useSentinelX';

function DashboardRoutes() {
  const {
    data,
    sensitivity,
    alerts,
    activeAlerts,
    alertsByDay,
    topRiskUsers,
    updateSensitivity,
    markAlert,
  } = useSentinelX();

  return (
    <DashboardLayout userCount={data.users.length}>
      <Routes>
        <Route index element={
          <Overview
            data={data}
            activeAlerts={activeAlerts}
            alertsByDay={alertsByDay}
            topRiskUsers={topRiskUsers}
            sensitivity={sensitivity}
          />
        } />
        <Route path="alerts" element={
          <AlertsPage
            alerts={alerts}
            users={data.users}
            sensitivity={sensitivity}
            onSensitivityChange={updateSensitivity}
          />
        } />
        <Route path="alerts/:alertId" element={
          <AlertDetail
            alerts={alerts}
            users={data.users}
            baselines={data.baselines}
            onMarkAlert={markAlert}
          />
        } />
        <Route path="explain" element={
          <ExplainPage
            alerts={alerts}
            users={data.users}
          />
        } />
        <Route path="false-positives" element={
          <FalsePositives
            alerts={alerts}
            users={data.users}
            onMarkAlert={markAlert}
          />
        } />
        <Route path="action-log" element={
          <ActionLog entries={data.actionLog} />
        } />
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
