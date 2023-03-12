import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../api/dto/create.user.dto';
import { UserRepository } from '../infrastructure/user-repository';
import { CreateUserDtoForDb } from '../api/dto/create.user.dto.for.db';
import { RegistrationUserDto } from '../../auth/api/dto/registration.user.dto';
import { UserQueryRepository } from '../infrastructure/user-query-repository';
import { randomUUID } from 'crypto';

@Injectable()
export class UserService {
  constructor(
    private usersRepository: UserRepository,
    private readonly userQueryRepository: UserQueryRepository,
  ) {}
  async createUser(dto: CreateUserDto) {
    const newUser = await this.createUserModelForDb(dto);
    const createdUser = await this.usersRepository.createUser({ ...newUser });
    if (!createdUser) throw new NotFoundException();
    return {
      id: createdUser.id,
      login: createdUser.accountData.login,
      email: createdUser.accountData.email,
      createdAt: createdUser.accountData.createdAt,
    };
  }

  deleteUserById(id: string) {
    return this.usersRepository.deleteUserById(id);
  }

  private async createUserModelForDb(dto: CreateUserDto) {
    const passwordHash = await this.generatePasswordHash(dto.password);

    return new CreateUserDtoForDb(dto, passwordHash);
  }

  private generatePasswordHash(password: string) {
    return bcrypt.genSalt(10).then((salt) => bcrypt.hash(password, salt));
  }

  async registerUser(dto: RegistrationUserDto) {
    const newUser = await this.createUserModelForDb(dto);
    const createdUser = await this.usersRepository.createUser({ ...newUser });
    if (!createdUser) throw new NotFoundException();
    return newUser;
  }

  async confirmUserEmail(code: string) {
    const user = await this.userQueryRepository.findUserByConfirmationCode(
      code,
    );
    if (!user) throw new BadRequestException('code');
    if (user.emailInfo.isConfirmed) throw new BadRequestException('code');
    await this.usersRepository.updateConfirmationStatus(user.id);
    return;
  }

  async updateRecoveryCode(id: string) {
    const newRecoveryCode = randomUUID();
    await this.usersRepository.updatePasswordRecoveryCode(id, newRecoveryCode);
    return newRecoveryCode;
  }

  async updatePassword(id: string, password: string) {
    const passwordHash = await this.generatePasswordHash(password);
    await this.usersRepository.changePassword(id, passwordHash);
    return;
  }
}
