import { registerDecorator, ValidationOptions } from 'class-validator';
import { RegistrationUserDto } from '../../features/auth/api/dto/registration.user.dto';
import { UserLoginExistValidator } from '../../validators/user-login.exist.validator';
import { CreateUserDto } from '../../features/users/api/dto/create.user.dto';

export function UserLoginExist(validationOptions?: ValidationOptions) {
  return function (
    object: RegistrationUserDto | CreateUserDto,
    propertyName: string,
  ) {
    registerDecorator({
      name: 'UserLoginExist',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: UserLoginExistValidator,
    });
  };
}
