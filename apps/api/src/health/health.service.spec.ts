import { HealthService } from './health.service';

describe('HealthService', () => {
  it('returns an ok status for the api service', () => {
    const result = new HealthService().check();
    expect(result.status).toBe('ok');
    expect(result.service).toBe('api');
  });
});
