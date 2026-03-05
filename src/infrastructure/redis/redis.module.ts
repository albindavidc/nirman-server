import { Global, Module, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis, type RedisOptions } from 'ioredis';
import { REDIS_CLIENT } from './redis.constants';
import { RedisService } from './redis.service';
import { SessionService } from './session.service';
import { BruteForceService } from './brute-force.service';
import { UserCacheService } from './user-cache.service';

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [ConfigService],
      useFactory: (config: ConfigService): Redis => {
        const logger = new Logger('RedisModule');

        const host = config.get<string>('REDIS_HOST', 'localhost');
        const port = parseInt(config.get<string>('REDIS_PORT', '6379'), 10);
        const password = config.get<string>('REDIS_PASSWORD');
        const tls = config.get<string>('REDIS_TLS') === 'true';

        const options: RedisOptions = {
          host,
          port,
          password: password ?? undefined,
          tls: tls ? {} : undefined,
          retryStrategy: (times: number): number | null => {
            if (times > 5) {
              logger.error('Redis connection failed after 5 retries');
              return null;
            }
            return Math.min(times * 500, 2000);
          },
          lazyConnect: false,
        };

        const client = new Redis(options);

        client.on('connect', () => logger.log('Redis connected'));
        client.on('error', (err) =>
          logger.error(`Redis error: ${err.message}`),
        );

        return client;
      },
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
})
export class RedisModule {}
