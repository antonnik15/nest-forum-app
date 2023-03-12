import { randomUUID } from 'crypto';
import { CreateUserDto } from './create.user.dto';

export class CreateUserDtoForDb {
  public readonly accountData: {
    login: string;
    email: string;
    passwordHash: string;
  };
  public readonly emailInfo: { confirmationCode: string; isConfirmed: boolean };
  public readonly passwordRecoveryInfo: {
    recoveryStatus: boolean;
    recoveryCode: string;
  };
  constructor(dto: CreateUserDto, passwordHash: string) {
    this.accountData = {
      login: dto.login,
      email: dto.email,
      passwordHash,
    };
    this.emailInfo = {
      confirmationCode: randomUUID(),
      isConfirmed: false,
    };
    this.passwordRecoveryInfo = {
      recoveryStatus: true,
      recoveryCode: null,
    };
  }
}
