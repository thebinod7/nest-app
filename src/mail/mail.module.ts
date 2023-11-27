import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

@Module({
	imports: [
		MailerModule.forRootAsync({
			useFactory: async (config: ConfigService) => ({
				transport: {
					host: config.get('EMAIL_HOST'),
					port: config.get('EMAIL_PORT'),
					secure: true,
					auth: {
						user: config.get('EMAIL_USER'),
						pass: config.get('EMAIL_PASS'),
					},
				},
				defaults: {
					from: `"No Reply" <${config.get('EMAIL_USER')}>`,
				},
				template: {
					dir: join(__dirname, './templates'),
					adapter: new HandlebarsAdapter(),
					options: {
						strict: true,
					},
				},
			}),
			inject: [ConfigService],
		}),
	],
	providers: [MailService],
	exports: [MailService],
})
export class MailModule {}
