import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

// TODO: dynamic context
@Injectable()
export class MailService {
	constructor(private mailerService: MailerService) {}

	async sendUserConfirmation(context: any, token: string) {
		await this.mailerService.sendMail({
			to: context.to,
			subject: context.subject || 'Subject not sent',
			template: context.template,
			context: {
				name: context.name,
				token,
			},
		});
	}
}
