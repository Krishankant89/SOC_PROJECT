import type { Severity } from '../types';

/**
 * Returns Tailwind CSS classes for a given severity level.
 * Covers background, text, ring, and border colours.
 */
export function getSeverityClasses(severity: Severity): {
  badge: string;
  text: string;
  dot: string;
  border: string;
} {
  switch (severity) {
    case 'critical':
      return {
        badge: 'bg-red-500/20 text-red-400 border border-red-500/40',
        text: 'text-red-400',
        dot: 'bg-red-500',
        border: 'border-red-500/50',
      };
    case 'high':
      return {
        badge: 'bg-orange-500/20 text-orange-400 border border-orange-500/40',
        text: 'text-orange-400',
        dot: 'bg-orange-500',
        border: 'border-orange-500/50',
      };
    case 'medium':
      return {
        badge: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40',
        text: 'text-yellow-400',
        dot: 'bg-yellow-500',
        border: 'border-yellow-500/50',
      };
    case 'low':
      return {
        badge: 'bg-green-500/20 text-green-400 border border-green-500/40',
        text: 'text-green-400',
        dot: 'bg-green-500',
        border: 'border-green-500/50',
      };
    case 'info':
      return {
        badge: 'bg-blue-500/20 text-blue-400 border border-blue-500/40',
        text: 'text-blue-400',
        dot: 'bg-blue-500',
        border: 'border-blue-500/50',
      };
  }
}

/** Format an ISO timestamp into a human-readable relative string. */
export function formatRelativeTime(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

/** Format an ISO timestamp to a local datetime string. */
export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}
