import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT } from './config/index';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const port = process.env.PORT?? 8000 ;
  // console.log(port);
  
  await app.listen(port);
  console.log(`Application is running on port ${port}`);
}
bootstrap();
