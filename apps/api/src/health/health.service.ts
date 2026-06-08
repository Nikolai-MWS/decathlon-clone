import { Injectable } from '@nestjs/common';
import { makeHealthStatus, type HealthStatus } from '@decathlon/shared';

@Injectable()
export class HealthService {
  check(): HealthStatus {
    return makeHealthStatus('api');
  }
}
