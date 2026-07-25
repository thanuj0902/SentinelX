import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';

interface DashboardLayoutProps {
  children: React.ReactNode;
  userCount?: number;
}

export default function DashboardLayout({ children, userCount }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-navy-950 text-white flex">
      <Sidebar userCount={userCount} />
      <main className="flex-1 min-w-0 p-4 lg:p-6 pt-16 lg:pt-6 pb-20 lg:pb-6">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
