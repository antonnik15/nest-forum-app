import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly config: ConfigService,
  ) {}
  private confirmationUrl = this.config.get<string>('EMAIL_CONFIRMATION_URL');

  async sendEmailConfirmationMessage(
    login: string,
    email: string,
    confirmationCode: string,
  ) {
    const confirmUrl = this.confirmationUrl + confirmationCode;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Registration on MISIS APP',
      template: './registration',
      context: {
        name: login,
        confirmUrl,
      },
    });
  }
}
