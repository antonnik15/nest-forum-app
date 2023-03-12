import { IsString, Length } from 'class-validator';
import { Trim } from '../../../../decorators/validation/trim.decorator';

export class CreatePostForBlogDto {
  @IsString()
  @Trim()
  @Length(1, 30)
  public title: string;

  @IsString()
  @Trim()
  @Length(1, 100)
  public shortDescription: string;

  @IsString()
  @Trim()
  @Length(1, 1000)
  public content: string;

  public blogId: string | null = null;
  public blogName: string | null = null;
}
