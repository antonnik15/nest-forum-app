import { IsString, Length } from 'class-validator';
import { Trim } from '../../../../decorators/validation/trim.decorator';

export class UpdateCommentDto {
  @IsString()
  @Trim()
  @Length(20, 300)
  content: string;
}
