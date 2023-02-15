import { Injectable } from '@nestjs/common';
import { User } from '../features/users/domain/entities/users.schema';
import { UserViewModel } from '../features/users/api/dto/user.view.model';

@Injectable()
export class UserViewModelMapper {
  createUserArray(users: User[]): UserViewModel[] {
    return users.map((u) => this.mapUserToViewModel(u));
  }
  mapUserToViewModel(user: User): UserViewModel {
    return {
      id: user.id,
      login: user.accountData.login,
      email: user.accountData.email,
      createdAt: user.accountData.createdAt,
    };
  }
}
