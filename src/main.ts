import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT } from './config/index';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const port = PORT ?? 8000;
  await app.listen(port);
  console.log(`Application is running on port ${port}`);
}
bootstrap();
