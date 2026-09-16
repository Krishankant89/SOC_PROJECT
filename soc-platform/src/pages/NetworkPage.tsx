import Header from '../components/layout/Header';
import SeverityBadge from '../components/ui/SeverityBadge';
import { mockNetworkEvents } from '../data/mockData';
import { formatRelativeTime } from '../utils/helpers';

const actionMap = {
  allowed: 'bg-green-500/20 text-green-400 border-green-500/30',
  blocked: 'bg-red-500/20 text-red-400 border-red-500/30',
  alerted: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
};

export default function NetworkPage() {
  return (
    <>
      <Header title="Network" subtitle="Suricata IDS events and traffic analysis" />
      <main className="p-6">
        <div className="rounded-xl bg-gray-900 border border-gray-800 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-800">
            <h3 className="text-sm font-semibold text-white">Network Events</h3>
            <p className="text-[11px] text-gray-500 mt-0.5">Real-time Suricata IDS alerts</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  {['Src IP', 'Dest IP', 'Protocol', 'Port', 'Action', 'Severity', 'Rule', 'Time'].map(
                    (col) => (
                      <th key={col} className="px-4 py-2.5 text-left text-[10px] font-semibold tracking-wider text-gray-500 uppercase whitespace-nowrap">
                        {col}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {mockNetworkEvents.map((ev, i) => (
                  <tr
                    key={ev.id}
                    className={`border-b border-gray-800/60 hover:bg-gray-800/40 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-800/20'}`}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-gray-200">{ev.srcIp}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-400">{ev.destIp}</td>
                    <td className="px-4 py-3 text-xs text-gray-400">{ev.protocol}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-400">{ev.port}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold border ${actionMap[ev.action]}`}>
                        {ev.action}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <SeverityBadge severity={ev.severity} />
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400 max-w-[200px]">
                      <span className="truncate block">{ev.rule}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{formatRelativeTime(ev.timestamp)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}
