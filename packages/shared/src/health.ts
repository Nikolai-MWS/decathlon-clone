export interface HealthStatus {
  status: 'ok';
  service: string;
  timestamp: string;
}

export function makeHealthStatus(service: string): HealthStatus {
  return { status: 'ok', service, timestamp: new Date().toISOString() };
}
