import { IsEmail, IsString } from 'class-validator';

export class RegistrationEmailResendingDto {
  @IsString()
  @IsEmail()
  email: string;
}
