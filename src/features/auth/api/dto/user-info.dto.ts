import { IsString } from 'class-validator';

export class UserInfoDto {
  @IsString()
  id: string;
  @IsString()
  login: string;
  @IsString()
  email: string;
}
