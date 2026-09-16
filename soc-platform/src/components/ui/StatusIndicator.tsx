import type { SystemService } from '../../types';

interface StatusIndicatorProps {
  status: SystemService['status'];
  label?: string;
  size?: 'sm' | 'md';
  pulse?: boolean;
}

const statusMap: Record<
  SystemService['status'],
  { dot: string; text: string; label: string }
> = {
  operational: {
    dot: 'bg-green-500',
    text: 'text-green-400',
    label: 'Operational',
  },
  degraded: {
    dot: 'bg-yellow-500',
    text: 'text-yellow-400',
    label: 'Degraded',
  },
  down: {
    dot: 'bg-red-500',
    text: 'text-red-400',
    label: 'Down',
  },
};

export default function StatusIndicator({
  status,
  label,
  size = 'sm',
  pulse = true,
}: StatusIndicatorProps) {
  const map = statusMap[status];
  const dotSize = size === 'md' ? 'w-2.5 h-2.5' : 'w-2 h-2';
  const textSize = size === 'md' ? 'text-xs' : 'text-[11px]';

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium ${map.text} ${textSize}`}>
      <span className="relative flex shrink-0">
        {pulse && status === 'operational' && (
          <span
            className={`absolute inline-flex h-full w-full rounded-full ${map.dot} opacity-60 animate-ping`}
          />
        )}
        <span className={`relative inline-flex rounded-full ${dotSize} ${map.dot}`} />
      </span>
      {label ?? map.label}
    </span>
  );
}
