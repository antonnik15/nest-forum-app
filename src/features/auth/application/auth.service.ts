import { Injectable } from '@nestjs/common';
import { RegistrationUserDto } from '../api/dto/registration.user.dto';
import { UserService } from '../../users/application/user.service';
import { EmailService } from '../../email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly emailService: EmailService,
  ) {}
  async registration(dto: RegistrationUserDto) {
    const user = await this.userService.registerUser(dto);
    await this.emailService.sendEmailConfirmationMessage(
      user.accountData.login,
      user.accountData.email,
      user.emailInfo.confirmationCode,
    );
  }
}
