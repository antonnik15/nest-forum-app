import { IsString, Matches } from 'class-validator';

export class RecoveryPasswordDto {
  @IsString()
  @Matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
  email: string;
}
