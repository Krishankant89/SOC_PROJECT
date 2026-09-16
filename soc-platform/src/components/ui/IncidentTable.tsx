import { ExternalLink } from 'lucide-react';
import type { Incident } from '../../types';
import SeverityBadge from '../ui/SeverityBadge';
import { formatRelativeTime } from '../../utils/helpers';

interface IncidentTableProps {
  incidents: Incident[];
  maxRows?: number;
  showViewAll?: boolean;
  onViewAll?: () => void;
}

const incidentStatusMap: Record<
  Incident['status'],
  { cls: string; label: string }
> = {
  open: { cls: 'bg-blue-500/20 text-blue-400 border-blue-500/30', label: 'Open' },
  investigating: {
    cls: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    label: 'Investigating',
  },
  contained: {
    cls: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    label: 'Contained',
  },
  resolved: {
    cls: 'bg-green-500/20 text-green-400 border-green-500/30',
    label: 'Resolved',
  },
};

export default function IncidentTable({
  incidents,
  maxRows,
  showViewAll = false,
  onViewAll,
}: IncidentTableProps) {
  const displayed = maxRows ? incidents.slice(0, maxRows) : incidents;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-800">
            {['ID', 'Title', 'Severity', 'Status', 'Assignee', 'Alerts', 'Updated'].map(
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
          {displayed.map((inc, i) => {
            const st = incidentStatusMap[inc.status];
            return (
              <tr
                key={inc.id}
                className={`border-b transition-colors hover:bg-gray-800/50 ${
                  i % 2 === 0 ? 'bg-transparent' : 'bg-gray-800/20'
                }`}
              >
                <td className="px-3 py-2.5 font-mono text-[11px] text-gray-500 whitespace-nowrap">
                  {inc.id}
                </td>
                <td className="px-3 py-2.5 text-gray-200 max-w-[280px]">
                  <span className="block truncate font-medium">{inc.title}</span>
                </td>
                <td className="px-3 py-2.5 whitespace-nowrap">
                  <SeverityBadge severity={inc.severity} />
                </td>
                <td className="px-3 py-2.5 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold border ${st.cls}`}
                  >
                    {st.label}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-[11px] text-gray-400 whitespace-nowrap">
                  {inc.assignee}
                </td>
                <td className="px-3 py-2.5 text-center">
                  <span className="inline-flex items-center justify-center w-7 h-5 rounded bg-gray-700/60 text-[11px] font-mono text-gray-300">
                    {inc.alertCount}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-[11px] text-gray-500 whitespace-nowrap">
                  {formatRelativeTime(inc.updatedAt)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {showViewAll && (
        <div className="flex justify-end px-3 py-2 border-t border-gray-800">
          <button
            type="button"
            onClick={onViewAll}
            className="flex items-center gap-1 text-[11px] font-medium text-cyan-400 hover:text-cyan-300 transition"
          >
            View all incidents
            <ExternalLink size={11} />
          </button>
        </div>
      )}
    </div>
  );
}
