import { describe, it, expect } from 'vitest';
import { makeHealthStatus, type HealthStatus } from './health';

describe('makeHealthStatus', () => {
  it('builds an ok status with the given service name', () => {
    const status: HealthStatus = makeHealthStatus('api');
    expect(status.status).toBe('ok');
    expect(status.service).toBe('api');
    expect(typeof status.timestamp).toBe('string');
  });
});
