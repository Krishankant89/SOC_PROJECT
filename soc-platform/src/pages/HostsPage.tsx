import { useEffect, useState } from 'react';
import Header from '../components/layout/Header';
import StatusIndicator from '../components/ui/StatusIndicator';
import {
  getHosts,
  mapBackendHost,
} from '../services/api';
import { formatRelativeTime } from '../utils/helpers';
import type { Host } from '../types';

const hostStatusMap: Record<
  Host['status'],
  'operational' | 'degraded' | 'down'
> = {
  online: 'operational',
  warning: 'degraded',
  offline: 'down',
};

export default function HostsPage() {
  const [hosts, setHosts] = useState<Host[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadHosts() {
      try {
        setLoading(true);
        setError(null);

        const data = await getHosts();

        setHosts(data.map(mapBackendHost));
      } catch (err) {
        console.error('Failed to load hosts:', err);
        setError('Failed to load hosts from backend.');
      } finally {
        setLoading(false);
      }
    }

    loadHosts();
    const interval = setInterval(loadHosts,10000)
    return () => clearInterval(interval)
  }, []);

  return (
    <>
      <Header
        title="Hosts"
        subtitle={`${hosts.length} monitored endpoints`}
      />

      <main className="p-6">
        <div className="rounded-xl bg-gray-900 border border-gray-800 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-800">
            <h3 className="text-sm font-semibold text-white">
              All Endpoints
            </h3>

            <p className="text-[11px] text-gray-500 mt-0.5">
              Wazuh agent status and host information
            </p>
          </div>

          {loading && (
            <div className="p-6 text-sm text-gray-400">
              Loading hosts...
            </div>
          )}

          {error && (
            <div className="p-6 text-sm text-red-400">
              {error}
            </div>
          )}

          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800">
                    {[
                      'Hostname',
                      'IP Address',
                      'OS',
                      'Status',
                      'Agent Ver.',
                      'Alerts',
                      'Last Seen',
                    ].map((col) => (
                      <th
                        key={col}
                        className="px-4 py-2.5 text-left text-[10px] font-semibold tracking-wider text-gray-500 uppercase whitespace-nowrap"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {hosts.map((host, i) => (
                    <tr
                      key={host.id}
                      className={`border-b border-gray-800/60 hover:bg-gray-800/40 transition-colors ${
                        i % 2 === 0 ? '' : 'bg-gray-800/20'
                      }`}
                    >
                      <td className="px-4 py-3 font-mono text-sm text-gray-200">
                        {host.hostname}
                      </td>

                      <td className="px-4 py-3 font-mono text-xs text-gray-400">
                        {host.ip}
                      </td>

                      <td className="px-4 py-3 text-xs text-gray-400">
                        {host.os}
                      </td>

                      <td className="px-4 py-3">
                        <StatusIndicator
                          status={hostStatusMap[host.status]}
                          label={
                            host.status.charAt(0).toUpperCase() +
                            host.status.slice(1)
                          }
                        />
                      </td>

                      <td className="px-4 py-3 font-mono text-xs text-gray-500">
                        {host.agentVersion}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center justify-center w-7 h-5 rounded text-xs font-mono font-semibold ${
                            host.alertCount > 5
                              ? 'bg-red-500/20 text-red-400'
                              : host.alertCount > 0
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-gray-700/60 text-gray-400'
                          }`}
                        >
                          {host.alertCount}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-xs text-gray-500">
                        {formatRelativeTime(host.lastSeen)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </>
  );
}