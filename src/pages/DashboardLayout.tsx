import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-navy-950">
      <Sidebar />
      <main className="flex-1 min-h-screen lg:pl-0">
        <div className="p-4 lg:p-6 pt-16 lg:pt-6 max-w-[1400px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
