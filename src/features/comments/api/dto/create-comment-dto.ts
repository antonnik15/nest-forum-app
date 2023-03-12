import { IsString, Length } from 'class-validator';
import { Trim } from '../../../../decorators/validation/trim.decorator';

export class CreateCommentDto {
  @IsString()
  @Trim()
  @Length(20, 300)
  public readonly content: string;
}
