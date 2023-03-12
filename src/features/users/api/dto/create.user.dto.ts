import { IsString, Length, Matches } from 'class-validator';
import { UserLoginExist } from '../../../../decorators/validation/user-login-exist.decorator';
import { UserEmailExist } from '../../../../decorators/validation/user-email-exist.decorator';
import { Trim } from '../../../../decorators/validation/trim.decorator';

export class CreateUserDto {
  @IsString()
  @Trim()
  @Length(3, 10)
  @Matches('^[a-zA-Z0-9_-]*$')
  @UserLoginExist()
  login: string;

  @IsString()
  @Trim()
  @Length(6, 20)
  password: string;

  @IsString()
  @Trim()
  @Matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
  @UserEmailExist()
  email: string;
}
