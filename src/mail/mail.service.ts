import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

// TODO: dynamic context
@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: any, token: string) {
    const url = `example.com/auth/confirm?token=${token}`;

    await this.mailerService.sendMail({
      to: 'binod@mailinator.com',
      subject: 'Welcome to Nice App! Confirm your Email',
      template: 'welcome',
      context: {
        name: user.name,
        url,
      },
    });
  }
}
