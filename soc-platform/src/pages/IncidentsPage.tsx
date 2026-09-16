import { useEffect, useState } from 'react';
import Header from '../components/layout/Header';
import IncidentTable from '../components/ui/IncidentTable';
import {
  getIncidents,
  mapBackendIncident,
} from '../services/api';
import type { Incident } from '../types';

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadIncidents() {
      try {
        setLoading(true);
        setError(null);

        const data = await getIncidents();
        setIncidents(data.map(mapBackendIncident));
      } catch (err) {
        console.error('Failed to load incidents:', err);
        setError('Failed to load incidents from backend.');
      } finally {
        setLoading(false);
      }
    }

    loadIncidents();

    const interval = setInterval(loadIncidents, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Header
        title="Incidents"
        subtitle={`${incidents.length} active incidents`}
      />

      <main className="p-6">
        <div className="rounded-xl bg-gray-900 border border-gray-800 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-800">
            <h3 className="text-sm font-semibold text-white">
              All Incidents
            </h3>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Incident response case management
            </p>
          </div>

          {loading && (
            <div className="p-6 text-sm text-gray-400">
              Loading incidents...
            </div>
          )}

          {error && (
            <div className="p-6 text-sm text-red-400">
              {error}
            </div>
          )}

          {!loading && !error && (
            <IncidentTable incidents={incidents} />
          )}
        </div>
      </main>
    </>
  );
}
