import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from '@nestjs/common';

const PORT = 3333;
const API_VERSION = 'v1';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors();
	app.useGlobalPipes(new ValidationPipe({ whitelist: true })); // For field validation
	app.setGlobalPrefix(`api/${API_VERSION}`);
	await app.listen(PORT);
	Logger.log(`Server running at port: ${PORT}`);
}
bootstrap();
