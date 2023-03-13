import { Injectable } from '@nestjs/common';
import {
  ThrottlerModuleOptions,
  ThrottlerOptionsFactory,
} from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ThrottlerConfig implements ThrottlerOptionsFactory {
  constructor(private readonly configService: ConfigService) {}
  private ttl = +this.configService.get('THROTTLE_TTL');
  private limit = +this.configService.get('THROTTLE_LIMIT');

  createThrottlerOptions(): ThrottlerModuleOptions {
    return {
      ttl: this.ttl,
      limit: this.limit,
    };
  }
}
