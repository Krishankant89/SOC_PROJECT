import type { Alert, Host, Incident } from '../types';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

/* -------------------------------------------------------------------------- */
/* Backend Types                                                              */
/* -------------------------------------------------------------------------- */

export interface BackendAlert {
  id: string;
  timestamp: string;
  source: string;
  source_ip: string | null;
  destination_ip: string | null;
  host: string;
  rule_name: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  status: 'new' | 'acknowledged' | 'resolved';
  description: string | null;
  raw_event: string | null;
}

export interface BackendIncident {
  id: string;
  title: string;
  description: string | null;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  status: 'open' | 'investigating' | 'contained' | 'resolved';
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
}

export interface BackendHost {
  id: string;
  hostname: string;
  ip_address: string | null;
  os: string | null;
  agent_version: string | null;
  status: 'online' | 'offline' | 'warning';
  alert_count: number;
  last_seen: string | null;
  registered_at: string;
}

/* -------------------------------------------------------------------------- */
/* Generic API Request                                                        */
/* -------------------------------------------------------------------------- */

async function request<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `API error ${response.status}: ${
        errorText || response.statusText
      }`,
    );
  }

  return response.json();
}

/* -------------------------------------------------------------------------- */
/* Alerts                                                                     */
/* -------------------------------------------------------------------------- */

export async function getAlerts(): Promise<BackendAlert[]> {
  return request<BackendAlert[]>('/alerts');
}

export async function getAlert(
  id: string,
): Promise<BackendAlert> {
  return request<BackendAlert>(`/alerts/${id}`);
}

export async function createAlert(
  alert: Omit<BackendAlert, 'id' | 'timestamp'> & {
    timestamp?: string;
  },
): Promise<BackendAlert> {
  return request<BackendAlert>('/alerts', {
    method: 'POST',
    body: JSON.stringify(alert),
  });
}

/* -------------------------------------------------------------------------- */
/* Incidents                                                                  */
/* -------------------------------------------------------------------------- */

export async function getIncidents(): Promise<BackendIncident[]> {
  return request<BackendIncident[]>('/incidents');
}

export async function createIncident(
  incident: Omit<
    BackendIncident,
    'id' | 'created_at' | 'updated_at'
  >,
): Promise<BackendIncident> {
  return request<BackendIncident>('/incidents', {
    method: 'POST',
    body: JSON.stringify(incident),
  });
}

export async function updateIncident(
  id: string,
  updates: Partial<
    Pick<
      BackendIncident,
      | 'status'
      | 'assigned_to'
      | 'title'
      | 'description'
      | 'severity'
    >
  >,
): Promise<BackendIncident> {
  return request<BackendIncident>(`/incidents/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
}

/* -------------------------------------------------------------------------- */
/* Hosts                                                                      */
/* -------------------------------------------------------------------------- */

export async function getHosts(): Promise<BackendHost[]> {
  return request<BackendHost[]>('/hosts');
}

/* -------------------------------------------------------------------------- */
/* Frontend Mappers                                                           */
/* -------------------------------------------------------------------------- */

export function mapBackendAlert(
  alert: BackendAlert,
): Alert {
  return {
    id: alert.id,
    title: alert.rule_name,
    severity: alert.severity,
    source: alert.source,
    host: alert.host,
    timestamp: alert.timestamp,
    status: alert.status,
    category: alert.description || 'Security Event',
  };
}

export function mapBackendIncident(
  incident: BackendIncident,
): Incident {
  return {
    id: incident.id,
    title: incident.title,
    description:  incident.description || 'Incident Description',
    severity: incident.severity,
    status: incident.status,
    assignee: incident.assigned_to || 'Unassigned',
    createdAt: incident.created_at,
    updatedAt: incident.updated_at,
    alertCount: 0,
  };
}

export function mapBackendHost(
  host: BackendHost,
): Host {
  return {
    id: host.id,
    hostname: host.hostname,
    ip: host.ip_address || 'N/A',
    os: host.os || 'Unknown',
    status: host.status,
    lastSeen:
      host.last_seen || host.registered_at,
    alertCount: host.alert_count,
    agentVersion:
      host.agent_version || 'N/A',
  };
}