import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    label: string;
    positive?: boolean; // true = up is good (e.g. online hosts), false = up is bad (e.g. critical alerts)
  };
  footer?: ReactNode;
  accent?: 'red' | 'orange' | 'yellow' | 'green' | 'cyan' | 'blue' | 'purple';
}

const accentMap: Record<NonNullable<StatCardProps['accent']>, string> = {
  red: 'border-red-500/30 shadow-red-500/5',
  orange: 'border-orange-500/30 shadow-orange-500/5',
  yellow: 'border-yellow-500/30 shadow-yellow-500/5',
  green: 'border-green-500/30 shadow-green-500/5',
  cyan: 'border-cyan-500/30 shadow-cyan-500/5',
  blue: 'border-blue-500/30 shadow-blue-500/5',
  purple: 'border-purple-500/30 shadow-purple-500/5',
};

export default function StatCard({
  title,
  value,
  icon: Icon,
  iconColor = 'text-cyan-400',
  iconBg = 'bg-cyan-500/10',
  trend,
  footer,
  accent,
}: StatCardProps) {
  const borderClass = accent ? accentMap[accent] : 'border-gray-800';

  const TrendIcon =
    trend?.direction === 'up'
      ? TrendingUp
      : trend?.direction === 'down'
        ? TrendingDown
        : Minus;

  const trendIsPositive =
    trend?.direction === 'neutral'
      ? null
      : trend?.positive
        ? trend.direction === 'up'
        : trend?.direction === 'down';

  const trendColor =
    trendIsPositive === null
      ? 'text-gray-500'
      : trendIsPositive
        ? 'text-green-400'
        : 'text-red-400';

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-gray-900 border ${borderClass} shadow-lg p-5 flex flex-col gap-3`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase">{title}</p>
        <div className={`flex items-center justify-center w-9 h-9 rounded-lg ${iconBg}`}>
          <Icon size={18} className={iconColor} />
        </div>
      </div>

      {/* Value */}
      <p className="text-3xl font-bold text-white tabular-nums leading-none">{value}</p>

      {/* Trend / Footer */}
      {trend && (
        <div className={`flex items-center gap-1 text-[11px] font-medium ${trendColor}`}>
          <TrendIcon size={12} />
          <span>{trend.label}</span>
        </div>
      )}
      {footer && <div className="mt-auto">{footer}</div>}
    </div>
  );
}
