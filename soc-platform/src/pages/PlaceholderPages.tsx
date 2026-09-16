import { Construction } from 'lucide-react';
import Header from '../components/layout/Header';

interface PlaceholderPageProps {
  title: string;
  subtitle?: string;
  description: string;
}

function PlaceholderPage({ title, subtitle, description }: PlaceholderPageProps) {
  return (
    <>
      <Header title={title} subtitle={subtitle} />
      <main className="flex flex-col items-center justify-center flex-1 p-12 gap-4">
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-800 border border-gray-700">
          <Construction size={28} className="text-gray-500" />
        </div>
        <div className="text-center max-w-sm">
          <h2 className="text-lg font-semibold text-white mb-1">{title}</h2>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-400 font-medium">
          Coming soon
        </span>
      </main>
    </>
  );
}

export function ReportsPage() {
  return (
    <PlaceholderPage
      title="Reports"
      subtitle="Security reporting and analytics"
      description="Generate scheduled and on-demand security reports. PDF export, executive summaries, and trend analysis will be available here."
    />
  );
}

export function AuditLogsPage() {
  return (
    <PlaceholderPage
      title="Audit Logs"
      subtitle="Platform activity and user actions"
      description="Track all user actions, configuration changes, and platform events. Full audit trail for compliance and forensic investigation."
    />
  );
}

export function SettingsPage() {
  return (
    <PlaceholderPage
      title="Settings"
      subtitle="Platform configuration"
      description="Manage integrations, notification channels, user accounts, and platform-wide security settings."
    />
  );
}

export function NotFoundPage() {
  return (
    <PlaceholderPage
      title="404 — Page Not Found"
      subtitle="Navigation error"
      description="The page you requested does not exist. Use the sidebar to navigate to a valid section."
    />
  );
}
