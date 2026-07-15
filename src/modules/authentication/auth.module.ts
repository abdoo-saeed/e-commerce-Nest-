import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createClient } from 'redis';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { userModel } from 'src/model';
import { UserRepo } from 'src/common/repo';
import { CacheService } from 'src/common/services/cache.service';
import { SecurityService } from 'src/common/services/security';


@Module({
  imports: [
  ConfigModule,
    userModel,
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: 'Client Redis',
      useFactory: async (configService: ConfigService) => {
        const client = createClient({
          url: configService.get<string>("REDIS_DB"),
        });

        client.on('error', (err) => {
          console.error('Redis error:', err);
        });

        await client.connect();
        console.log("redis is connected");
        

        return client;
      },
      inject: [ConfigService],
    },
    AuthService,
    UserRepo,
    CacheService,
    SecurityService

  ],
  exports: ['Client Redis', ],
})
export class AuthModule {}