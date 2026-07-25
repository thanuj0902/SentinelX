import { NavLink, useLocation } from 'react-router-dom';
import { NAV_ITEMS } from '../config/nav';

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass-card-strong border-t border-cyan-500/10 safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {NAV_ITEMS.map(item => {
          const isActive = location.pathname === item.path ||
            (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-[52px] ${
                isActive
                  ? 'text-cyan-400'
                  : 'text-white/30 hover:text-white/50'
              }`}
            >
              <div className={`p-1 rounded-lg transition-all duration-200 ${isActive ? 'bg-cyan-500/15' : ''}`}>
                <item.icon size={18} />
              </div>
              <span className="text-[10px] font-medium">{item.shortLabel}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
