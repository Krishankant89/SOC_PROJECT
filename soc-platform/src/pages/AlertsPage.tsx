import { useEffect, useState } from 'react';
import Header from '../components/layout/Header';
import AlertTable from '../components/ui/AlertTable';
import type { Alert } from '../types';
import { getAlerts, mapBackendAlert } from '../services/api';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAlerts() {
      try {
        setLoading(true);
        setError(null);

        const data = await getAlerts();
        setAlerts(data.map(mapBackendAlert));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load alerts',
        );
      } finally {
        setLoading(false);
      }
    }

    loadAlerts();

    const interval = setInterval(loadAlerts, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Header
        title="Alerts"
        subtitle={
          loading ? 'Loading alerts...' : `${alerts.length} total alerts`
        }
      />

      <main className="p-6">
        <div className="rounded-xl bg-gray-900 border border-gray-800 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-800">
            <h3 className="text-sm font-semibold text-white">All Alerts</h3>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Security events from the SOC backend
            </p>
          </div>

          {loading && (
            <div className="p-6 text-sm text-gray-400">
              Loading alerts...
            </div>
          )}

          {error && (
            <div className="p-6 text-sm text-red-400">
              {error}
            </div>
          )}

          {!loading && !error && <AlertTable alerts={alerts} />}
        </div>
      </main>
    </>
  );
}
