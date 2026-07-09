import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './modules/authentication/auth.controller';
import { AuthModule } from './modules/authentication/auth.module';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
      ConfigModule.forRoot({
      envFilePath:['.env.dev','.env.prod'],
      isGlobal: true,
    }),

    AuthModule,
    UserModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
