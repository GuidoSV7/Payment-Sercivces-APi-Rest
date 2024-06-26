import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { envs } from './config';


async function bootstrap() {
  const logger = new Logger('Payments-ms');
  

  const app = await NestFactory.create(AppModule, {
    rawBody: true
  });
  
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.NATS,
  //   options: {
  //     servers: envs.natsServers,
  //   },
  // }, {
  //   inheritAppConfig: true
  // })


  await app.startAllMicroservices();
  
  await app.listen(envs.port);

  console.log('Health Check configured');

  logger.log(`Payments Microservice running on port ${envs.port}`);
}
bootstrap();
