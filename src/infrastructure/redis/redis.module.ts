import { Global, Module, DynamicModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import { REDIS_CLIENT } from './redis.constants';
import { RedisService } from './redis.service';
import { SessionService } from './session.service';
import { BruteForceService } from './brute-force.service';
import { UserCacheService } from './user-cache.service';

@Global()
@Module({})
export class RedisModule {
  static forRootAsync(): DynamicModule {
    return {
      module: RedisModule,
      global: true,
      imports: [ConfigModule],
      providers: [
        {
          provide: REDIS_CLIENT,
          useFactory: (config: ConfigService): Redis => {
            const host = config.getOrThrow<string>('REDIS_HOST');
            const port = Number(config.getOrThrow<string>('REDIS_PORT'));
            const password = config.getOrThrow<string>('REDIS_PASSWORD');
            const tls = config.get<string>('REDIS_TLS') === 'true';

            console.log('>>> Redis config:', { host, port, tls });

            return new Redis({
              host,
              port,
              password,
              tls: tls ? { rejectUnauthorized: false } : undefined,
            });
          },
          inject: [ConfigService],
        },
        RedisService,
        SessionService,
        BruteForceService,
        UserCacheService,
      ],
      exports: [
        REDIS_CLIENT,
        RedisService,
        SessionService,
        BruteForceService,
        UserCacheService,
      ],
    };
  }
}
