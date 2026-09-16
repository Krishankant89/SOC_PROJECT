import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import DashboardPage from './pages/DashboardPage';
import AlertsPage from './pages/AlertsPage';
import IncidentsPage from './pages/IncidentsPage';
import HostsPage from './pages/HostsPage';
import NetworkPage from './pages/NetworkPage';
import {
  ReportsPage,
  AuditLogsPage,
  SettingsPage,
  NotFoundPage,
} from './pages/PlaceholderPages';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'alerts', element: <AlertsPage /> },
      { path: 'incidents', element: <IncidentsPage /> },
      { path: 'hosts', element: <HostsPage /> },
      { path: 'network', element: <NetworkPage /> },
      { path: 'reports', element: <ReportsPage /> },
      { path: 'audit-logs', element: <AuditLogsPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
