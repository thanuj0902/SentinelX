import { NavLink, useLocation } from 'react-router-dom';
import { Shield, LayoutDashboard, AlertTriangle, Brain, ToggleLeft, ClipboardList, Activity, Menu, X } from 'lucide-react';
import { useState } from 'react';

const NAV_ITEMS = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
  { path: '/dashboard/alerts', icon: AlertTriangle, label: 'Alerts' },
  { path: '/dashboard/explain', icon: Brain, label: 'Explainability' },
  { path: '/dashboard/false-positives', icon: ToggleLeft, label: 'FP Control' },
  { path: '/dashboard/action-log', icon: ClipboardList, label: 'Action Log' },
];

interface SidebarProps {
  userCount?: number;
}

export default function Sidebar({ userCount = 200 }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-navy-800 border border-cyan-500/20"
        aria-label="Open menu"
      >
        <Menu size={20} className="text-cyan-400" />
      </button>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/60 z-40" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen z-50 w-64 bg-navy-900/95 backdrop-blur-xl border-r border-cyan-500/10
        flex flex-col transition-transform duration-300
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-5 flex items-center justify-between border-b border-cyan-500/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center">
              <Shield size={20} className="text-navy-950" />
            </div>
            <div>
              <h1 className="font-display text-base font-bold tracking-tight text-white">SentinelX</h1>
              <p className="text-[10px] text-cyan-400/60 uppercase tracking-widest">Threat Hunter</p>
            </div>
          </div>
          <button onClick={() => setMobileOpen(false)} className="lg:hidden text-white/50 hover:text-white" aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {NAV_ITEMS.map(item => {
            const isActive = location.pathname === item.path || 
              (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive 
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                    : 'text-white/50 hover:text-white/80 hover:bg-navy-800/50 border border-transparent'
                  }`}
              >
                <item.icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-cyan-500/10">
          <div className="flex items-center gap-2 px-2">
            <Activity size={14} className="text-emerald-500 animate-pulse" />
            <span className="text-xs text-emerald-400">Engine Active</span>
          </div>
          <p className="text-[10px] text-white/30 mt-1 px-2">{userCount} users monitored</p>
        </div>
      </aside>
    </>
  );
}
