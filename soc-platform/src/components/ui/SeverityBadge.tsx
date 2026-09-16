import type { Severity } from '../../types';
import { getSeverityClasses } from '../../utils/helpers';

interface SeverityBadgeProps {
  severity: Severity;
  showDot?: boolean;
  size?: 'sm' | 'md';
}

const labels: Record<Severity, string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
  info: 'Info',
};

export default function SeverityBadge({
  severity,
  showDot = true,
  size = 'sm',
}: SeverityBadgeProps) {
  const cls = getSeverityClasses(severity);
  const sizeClass = size === 'md' ? 'px-2.5 py-1 text-xs' : 'px-2 py-0.5 text-[11px]';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold tracking-wide ${cls.badge} ${sizeClass}`}
    >
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${cls.dot} shrink-0`} />}
      {labels[severity]}
    </span>
  );
}
