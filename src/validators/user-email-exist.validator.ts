import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UserQueryRepository } from '../features/users/infrastructure/user-query-repository';

@ValidatorConstraint({ name: 'UserEmailExist', async: true })
@Injectable()
export class UserEmailExistValidator implements ValidatorConstraintInterface {
  constructor(private readonly userQueryRepository: UserQueryRepository) {}
  async validate(email: string) {
    try {
      const user = await this.userQueryRepository.findUserByEmail(email);
      return !user;
    } catch (e) {
      return false;
    }
  }

  defaultMessage(arg?: ValidationArguments): string {
    return 'This email already exists';
  }
}
