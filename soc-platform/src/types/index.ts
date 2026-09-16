// ─── Severity ─────────────────────────────────────────────────────────────────
export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';

// ─── Alert ────────────────────────────────────────────────────────────────────
export interface Alert {
  id: string;
  title: string;
  severity: Severity;
  source: string;
  host: string;
  timestamp: string;
  status: 'new' | 'acknowledged' | 'resolved';
  category: string;
}

// ─── Incident ─────────────────────────────────────────────────────────────────
export interface Incident {
  id: string;
  title: string;
  severity: Severity;
  status: 'open' | 'investigating' | 'contained' | 'resolved';
  assignee: string;
  createdAt: string;
  updatedAt: string;
  alertCount: number;
}

// ─── Host ─────────────────────────────────────────────────────────────────────
export interface Host {
  id: string;
  hostname: string;
  ip: string;
  os: string;
  status: 'online' | 'offline' | 'warning';
  lastSeen: string;
  alertCount: number;
  agentVersion: string;
}

// ─── NetworkEvent ─────────────────────────────────────────────────────────────
export interface NetworkEvent {
  id: string;
  srcIp: string;
  destIp: string;
  protocol: string;
  port: number;
  action: 'allowed' | 'blocked' | 'alerted';
  severity: Severity;
  timestamp: string;
  rule: string;
}

// ─── Chart data ───────────────────────────────────────────────────────────────
export interface AlertTrendPoint {
  time: string;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export interface SeverityDistribution {
  name: string;
  value: number;
  color: string;
}

// ─── System Service ───────────────────────────────────────────────────────────
export interface SystemService {
  name: string;
  status: 'operational' | 'degraded' | 'down';
  uptime: string;
  lastCheck: string;
}
