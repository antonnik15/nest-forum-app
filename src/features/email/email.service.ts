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
  private passwordRecoveryUrl = this.config.get<string>(
    'PASSWORD_RECOVERY_URL',
  );

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

  async sendPasswordRecoveryCode(
    email: string,
    login: string,
    recoveryCode: string,
  ) {
    const passwordRecoveryUrl = this.passwordRecoveryUrl + recoveryCode;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Password Recovery',
      template: './password-recovery',
      context: {
        recoveryUrl: passwordRecoveryUrl,
      },
    });
  }
}
