import { Bell, Search, RefreshCw, Wifi } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between h-14 px-6 bg-gray-950/90 backdrop-blur border-b border-gray-800">
      {/* Page title */}
      <div>
        <h1 className="text-sm font-semibold text-white">{title}</h1>
        {subtitle && <p className="text-[11px] text-gray-500">{subtitle}</p>}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Search bar */}
        <div className="relative hidden sm:block">
          <Search
            size={14}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search…"
            className="w-48 pl-8 pr-3 py-1.5 text-xs rounded-md bg-gray-800 border border-gray-700 text-gray-300 placeholder-gray-600 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition"
          />
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-green-500/10 border border-green-500/20">
          <Wifi size={12} className="text-green-400" />
          <span className="text-[11px] font-medium text-green-400">LIVE</span>
        </div>

        {/* Refresh */}
        <button
          type="button"
          className="p-1.5 rounded-md text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition"
          title="Refresh"
        >
          <RefreshCw size={15} />
        </button>

        {/* Notifications */}
        <button
          type="button"
          className="relative p-1.5 rounded-md text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition"
          title="Notifications"
        >
          <Bell size={15} />
          <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-red-500 ring-1 ring-gray-950" />
        </button>
      </div>
    </header>
  );
}
