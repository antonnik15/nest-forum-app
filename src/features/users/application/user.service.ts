import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../api/dto/create.user.dto';
import { UserRepository } from '../infrastructure/user-repository';
import { randomUUID } from 'crypto';

@Injectable()
export class UserService {
  constructor(private usersRepository: UserRepository) {}
  async createUser(dto: CreateUserDto) {
    const newUser = await this.createUserModelForDb(dto);
    const result = await this.usersRepository.createUser({ ...newUser });
    if (!result) throw new NotFoundException();
    return;
  }

  deletePostById(id: string) {
    this.usersRepository.deletePostById(id);
    return;
  }

  private async createUserModelForDb(dto: CreateUserDto) {
    const passwordHash = await this.generatePasswordHash(dto.password);

    return {
      id: (+new Date()).toString(),
      accountData: {
        login: dto.login,
        email: dto.email,
        passwordHash,
        createdAt: new Date().toISOString(),
      },
      emailInfo: {
        confirmationCode: randomUUID(),
        isConfirmed: false,
      },
    };
  }

  private async generatePasswordHash(password: string) {
    return bcrypt.genSalt(10).then((salt) => bcrypt.hash(password, salt));
  }
}
