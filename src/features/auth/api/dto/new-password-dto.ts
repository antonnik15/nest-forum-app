import { IsString, Length } from 'class-validator';

export class NewPasswordDto {
  @IsString()
  @Length(6, 30)
  newPassword: string;

  @IsString()
  recoveryCode: string;
}
