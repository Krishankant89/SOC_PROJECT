import type { ReactNode } from 'react';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export default function ChartCard({
  title,
  subtitle,
  children,
  actions,
  className = '',
}: ChartCardProps) {
  return (
    <div className={`rounded-xl bg-gray-900 border border-gray-800 p-5 flex flex-col gap-4 ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          {subtitle && <p className="text-[11px] text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        {actions && <div className="shrink-0">{actions}</div>}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
