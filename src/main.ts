import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AbilityGuard } from './ability/ability.guard';
import { AbilityFactory } from './ability/ability.factory/ability.factory';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true })); // For field validation
  // app.useGlobalGuards(new AbilityGuard(new Reflector(), new AbilityFactory()));
  await app.listen(3333);
}
bootstrap();
