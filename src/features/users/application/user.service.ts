import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../api/dto/create.user.dto';
import { UserRepository } from '../infrastructure/user-repository';
import { CreateUserDtoForDb } from '../api/dto/create.user.dto.for.db';

@Injectable()
export class UserService {
  constructor(private usersRepository: UserRepository) {}
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

  private async generatePasswordHash(password: string) {
    return bcrypt.genSalt(10).then((salt) => bcrypt.hash(password, salt));
  }
}
