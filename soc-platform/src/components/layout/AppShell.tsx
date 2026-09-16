import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function AppShell() {
  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 overflow-hidden">
      <Sidebar />
      {/* Main content area — offset by sidebar width */}
      <div className="flex flex-col flex-1 ml-60 min-w-0 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
