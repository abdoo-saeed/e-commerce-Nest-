import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './modules/authentication/auth.controller';
import { AuthModule } from './modules/authentication/auth.module';
import { UserModule } from './modules/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Module({
  imports: [
      ConfigModule.forRoot({
      envFilePath:['.env.dev','.env.prod'],
      isGlobal: true,
    }),

    
MongooseModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    uri: configService.get<string>('DB_URI'),
    onConnectionCreate: (connection: Connection) => {
    connection.on('connected', () => console.log('DB connected successfully'));
    connection.on('open', () => console.log('DB connection opened'));
    connection.on('disconnected', () => console.log('disconnected'));
    connection.on('reconnected', () => console.log('reconnected'));
    connection.on('disconnecting', () => console.log('disconnecting'));

    return connection;
  },
  }),
  inject: [ConfigService],
}),

    AuthModule,
    UserModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
