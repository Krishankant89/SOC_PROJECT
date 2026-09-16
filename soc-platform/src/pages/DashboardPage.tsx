import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  AlertTriangle,
  FolderOpen,
  Monitor,
  Activity,
  CheckCircle,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

import Header from '../components/layout/Header';
import StatCard from '../components/ui/StatCard';
import ChartCard from '../components/ui/ChartCard';
import AlertTable from '../components/ui/AlertTable';
import IncidentTable from '../components/ui/IncidentTable';
import StatusIndicator from '../components/ui/StatusIndicator';

import {
  getAlerts,
  getIncidents,
  getHosts,
  mapBackendAlert,
  mapBackendIncident,
  mapBackendHost,
} from '../services/api';

import {
  mockAlertTrend,
  mockSystemServices,
} from '../data/mockData';

import type { Alert, Incident, Host } from '../types';

export default function DashboardPage() {
  const navigate = useNavigate();

  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [hosts, setHosts] = useState<Host[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
useEffect(() => {
  async function loadDashboard() {
    try {
      setLoading(true);
      setError(null);

      const [alertData, incidentData, hostData] =
        await Promise.all([
          getAlerts(),
          getIncidents(),
          getHosts(),
        ]);

      setAlerts(alertData.map(mapBackendAlert));
      setIncidents(incidentData.map(mapBackendIncident));
      setHosts(hostData.map(mapBackendHost));
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      setError('Failed to load dashboard data from backend.');
    } finally {
      setLoading(false);
    }
  }

  loadDashboard();

  const interval = setInterval(loadDashboard, 10000);

  return () => clearInterval(interval);
}, []);

  const criticalAlerts = alerts.filter(
    (alert) => alert.severity === 'critical',
  ).length;

  const openIncidents = incidents.filter(
    (incident) => incident.status !== 'resolved',
  ).length;

  const onlineHosts = hosts.filter(
    (host) => host.status === 'online',
  ).length;

  const severityDistribution = [
    {
      name: 'Critical',
      value: alerts.filter((a) => a.severity === 'critical').length,
      color: '#ef4444',
    },
    {
      name: 'High',
      value: alerts.filter((a) => a.severity === 'high').length,
      color: '#f97316',
    },
    {
      name: 'Medium',
      value: alerts.filter((a) => a.severity === 'medium').length,
      color: '#eab308',
    },
    {
      name: 'Low',
      value: alerts.filter((a) => a.severity === 'low').length,
      color: '#22c55e',
    },
    {
      name: 'Info',
      value: alerts.filter((a) => a.severity === 'info').length,
      color: '#3b82f6',
    },
  ].filter((item) => item.value > 0);

  return (
    <>
      <Header
        title="Security Operations Center"
        subtitle="Overview — Last 24 hours"
      />

      <main className="flex flex-col gap-6 p-6">

        {/* Loading */}
        {loading && (
          <div className="rounded-xl bg-gray-900 border border-gray-800 p-4 text-sm text-gray-400">
            Loading dashboard data...
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-xl bg-gray-900 border border-red-900 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* ── Stat Cards ──────────────────────────────────────────── */}
        <section className="grid grid-cols-2 xl:grid-cols-4 gap-4">

          <StatCard
            title="Total Alerts"
            value={alerts.length}
            icon={Bell}
            iconColor="text-blue-400"
            iconBg="bg-blue-500/10"
            accent="blue"
            trend={{
              direction: 'neutral',
              label: 'Live backend data',
            }}
          />

          <StatCard
            title="Critical Alerts"
            value={criticalAlerts}
            icon={AlertTriangle}
            iconColor="text-red-400"
            iconBg="bg-red-500/10"
            accent="red"
            trend={{
              direction: 'neutral',
              label: 'Current total',
            }}
          />

          <StatCard
            title="Open Incidents"
            value={openIncidents}
            icon={FolderOpen}
            iconColor="text-orange-400"
            iconBg="bg-orange-500/10"
            accent="orange"
            trend={{
              direction: 'neutral',
              label: 'Current total',
            }}
          />

          <StatCard
            title="Online Hosts"
            value={`${onlineHosts} / ${hosts.length}`}
            icon={Monitor}
            iconColor="text-green-400"
            iconBg="bg-green-500/10"
            accent="green"
            trend={{
              direction: 'neutral',
              label: 'Live backend data',
            }}
          />

        </section>

        {/* ── Charts ──────────────────────────────────────────────── */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">

          {/* Alert Trend - still mock until backend aggregation exists */}
          <ChartCard
            title="Alert Trend"
            subtitle="24-hour alert volume by severity"
            className="xl:col-span-2"
          >
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart
                data={mockAlertTrend}
                margin={{
                  top: 4,
                  right: 8,
                  left: -20,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient
                    id="gradCritical"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#ef4444"
                      stopOpacity={0.35}
                    />
                    <stop
                      offset="95%"
                      stopColor="#ef4444"
                      stopOpacity={0}
                    />
                  </linearGradient>

                  <linearGradient
                    id="gradHigh"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#f97316"
                      stopOpacity={0.35}
                    />
                    <stop
                      offset="95%"
                      stopColor="#f97316"
                      stopOpacity={0}
                    />
                  </linearGradient>

                  <linearGradient
                    id="gradMedium"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#eab308"
                      stopOpacity={0.25}
                    />
                    <stop
                      offset="95%"
                      stopColor="#eab308"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1f2937"
                />

                <XAxis
                  dataKey="time"
                  tick={{
                    fontSize: 10,
                    fill: '#6b7280',
                  }}
                />

                <YAxis
                  tick={{
                    fontSize: 10,
                    fill: '#6b7280',
                  }}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111827',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="critical"
                  stroke="#ef4444"
                  strokeWidth={2}
                  fill="url(#gradCritical)"
                  name="Critical"
                />

                <Area
                  type="monotone"
                  dataKey="high"
                  stroke="#f97316"
                  strokeWidth={2}
                  fill="url(#gradHigh)"
                  name="High"
                />

                <Area
                  type="monotone"
                  dataKey="medium"
                  stroke="#eab308"
                  strokeWidth={1.5}
                  fill="url(#gradMedium)"
                  name="Medium"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Severity Distribution - REAL */}
          <ChartCard
            title="Severity Distribution"
            subtitle="Total alerts by severity level"
          >
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={severityDistribution}
                  cx="50%"
                  cy="46%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {severityDistribution.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={entry.color}
                      opacity={0.85}
                    />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111827',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />

                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{
                    fontSize: '11px',
                    color: '#9ca3af',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

        </section>

        {/* ── Tables ──────────────────────────────────────────────── */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">

          {/* Recent Alerts - REAL */}
          <div className="rounded-xl bg-gray-900 border border-gray-800 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Recent Alerts
                </h3>

                <p className="text-[11px] text-gray-500 mt-0.5">
                  Latest security events
                </p>
              </div>

              <Activity size={16} className="text-gray-600" />
            </div>

            <AlertTable
              alerts={alerts}
              maxRows={5}
              showViewAll
              onViewAll={() => navigate('/alerts')}
            />
          </div>

          {/* Active Incidents - REAL */}
          <div className="rounded-xl bg-gray-900 border border-gray-800 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Active Incidents
                </h3>

                <p className="text-[11px] text-gray-500 mt-0.5">
                  Ongoing investigations
                </p>
              </div>

              <FolderOpen size={16} className="text-gray-600" />
            </div>

            <IncidentTable
              incidents={incidents}
              maxRows={5}
              showViewAll
              onViewAll={() => navigate('/incidents')}
            />
          </div>

        </section>

        {/* ── System Status ────────────────────────────────────────── */}
        <section className="rounded-xl bg-gray-900 border border-gray-800 overflow-hidden">

          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
            <div>
              <h3 className="text-sm font-semibold text-white">
                System Status
              </h3>

              <p className="text-[11px] text-gray-500 mt-0.5">
                Core services health
              </p>
            </div>

            <CheckCircle
              size={16}
              className="text-green-500"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-x divide-gray-800">
            {mockSystemServices.map((svc) => (
              <div
                key={svc.name}
                className="flex flex-col gap-2 px-5 py-4"
              >
                <StatusIndicator
                  status={svc.status}
                  size="sm"
                />

                <p className="text-xs font-medium text-gray-200 leading-tight">
                  {svc.name}
                </p>

                <p className="text-[10px] text-gray-600">
                  Uptime: {svc.uptime}
                </p>
              </div>
            ))}
          </div>

        </section>

      </main>
    </>
  );
}