import { ExternalLink } from 'lucide-react';
import type { Alert } from '../../types';
import SeverityBadge from '../ui/SeverityBadge';
import { formatRelativeTime } from '../../utils/helpers';

interface AlertTableProps {
  alerts: Alert[];
  maxRows?: number;
  showViewAll?: boolean;
  onViewAll?: () => void;
}

const statusClasses: Record<Alert['status'], string> = {
  new: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  acknowledged: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  resolved: 'bg-green-500/20 text-green-400 border-green-500/30',
};

const statusLabels: Record<Alert['status'], string> = {
  new: 'New',
  acknowledged: 'Ack',
  resolved: 'Resolved',
};

export default function AlertTable({
  alerts,
  maxRows,
  showViewAll = false,
  onViewAll,
}: AlertTableProps) {
  const displayed = maxRows ? alerts.slice(0, maxRows) : alerts;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-800">
            {['ID', 'Alert', 'Severity', 'Source', 'Host', 'Category', 'Status', 'Time'].map(
              (col) => (
                <th
                  key={col}
                  className="px-3 py-2 text-left text-[10px] font-semibold tracking-wider text-gray-500 uppercase whitespace-nowrap"
                >
                  {col}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {displayed.map((alert, i) => (
            <tr
              key={alert.id}
              className={`border-b transition-colors hover:bg-gray-800/50 ${
                i % 2 === 0 ? 'bg-transparent' : 'bg-gray-800/20'
              }`}
            >
              <td className="px-3 py-2.5 font-mono text-[11px] text-gray-500 whitespace-nowrap">
                {alert.id}
              </td>
              <td className="px-3 py-2.5 text-gray-200 max-w-[240px]">
                <span className="block truncate font-medium">{alert.title}</span>
              </td>
              <td className="px-3 py-2.5 whitespace-nowrap">
                <SeverityBadge severity={alert.severity} />
              </td>
              <td className="px-3 py-2.5 text-[11px] text-gray-400 whitespace-nowrap">
                {alert.source}
              </td>
              <td className="px-3 py-2.5 font-mono text-[11px] text-gray-400 whitespace-nowrap">
                {alert.host}
              </td>
              <td className="px-3 py-2.5 text-[11px] text-gray-400 whitespace-nowrap">
                {alert.category}
              </td>
              <td className="px-3 py-2.5 whitespace-nowrap">
                <span
                  className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusClasses[alert.status]}`}
                >
                  {statusLabels[alert.status]}
                </span>
              </td>
              <td className="px-3 py-2.5 text-[11px] text-gray-500 whitespace-nowrap">
                {formatRelativeTime(alert.timestamp)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showViewAll && (
        <div className="flex justify-end px-3 py-2 border-t border-gray-800">
          <button
            type="button"
            onClick={onViewAll}
            className="flex items-center gap-1 text-[11px] font-medium text-cyan-400 hover:text-cyan-300 transition"
          >
            View all alerts
            <ExternalLink size={11} />
          </button>
        </div>
      )}
    </div>
  );
}
