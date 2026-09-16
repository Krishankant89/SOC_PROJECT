import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Bell,
  FolderOpen,
  Monitor,
  Network,
  BarChart3,
  ScrollText,
  Settings,
  Shield,
  ChevronRight,
} from 'lucide-react';

interface NavItem {
  label: string;
  to: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', to: '/', icon: <LayoutDashboard size={18} /> },
  { label: 'Alerts', to: '/alerts', icon: <Bell size={18} /> },
  { label: 'Incidents', to: '/incidents', icon: <FolderOpen size={18} /> },
  { label: 'Hosts', to: '/hosts', icon: <Monitor size={18} /> },
  { label: 'Network', to: '/network', icon: <Network size={18} /> },
  { label: 'Reports', to: '/reports', icon: <BarChart3 size={18} /> },
  { label: 'Audit Logs', to: '/audit-logs', icon: <ScrollText size={18} /> },
  { label: 'Settings', to: '/settings', icon: <Settings size={18} /> },
];

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 w-60 flex flex-col bg-gray-900 border-r border-gray-800 select-none">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-800">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
          <Shield size={20} className="text-cyan-400" />
        </div>
        <div>
          <p className="text-sm font-bold text-white tracking-wide leading-none">SOC Platform</p>
          <p className="text-[10px] text-gray-500 mt-0.5 tracking-widest uppercase">Monitoring & IR</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        <p className="px-2 mb-2 text-[10px] font-semibold tracking-widest text-gray-600 uppercase">
          Main Menu
        </p>
        {navItems.map(({ label, to, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              [
                'group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200 border border-transparent',
              ].join(' ')
            }
          >
            <span className="shrink-0">{icon}</span>
            <span className="flex-1">{label}</span>
            <ChevronRight
              size={14}
              className="opacity-0 group-hover:opacity-40 transition-opacity"
            />
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
            AC
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-200 truncate">Alice Chen</p>
            <p className="text-[10px] text-gray-500 truncate">SOC Analyst L2</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
