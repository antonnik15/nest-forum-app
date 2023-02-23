import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UserQueryRepository } from '../features/users/infrastructure/user-query-repository';

@ValidatorConstraint({ name: 'UserLoginExist', async: true })
@Injectable()
export class UserLoginExistValidator implements ValidatorConstraintInterface {
  constructor(private readonly userQueryRepository: UserQueryRepository) {}

  async validate(login: string) {
    try {
      const user = await this.userQueryRepository.findUserByLogin(login);
      return !user;
    } catch (e) {
      return false;
    }
  }
  defaultMessage(arg?: ValidationArguments): string {
    return 'This login already exists';
  }
}
