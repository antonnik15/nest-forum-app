import { registerDecorator, ValidationOptions } from 'class-validator';
import { RegistrationUserDto } from '../../features/auth/api/dto/registration.user.dto';
import { CreateUserDto } from '../../features/users/api/dto/create.user.dto';
import { UserEmailExistValidator } from '../../validators/user-email-exist.validator';

export function UserEmailExist(validationOptions?: ValidationOptions) {
  return function (
    object: RegistrationUserDto | CreateUserDto,
    propertyName: string,
  ) {
    registerDecorator({
      name: 'UserEmailExist',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: UserEmailExistValidator,
    });
  };
}
