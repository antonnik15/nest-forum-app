import { IsString, MaxLength } from 'class-validator';
import { Trim } from '../../../../decorators/validation/trim.decorator';
import { BlogExist } from '../../../../decorators/validation/blog-exist.decorator';

export class CreatePostDto {
  @IsString()
  @Trim()
  @MaxLength(30)
  title: string;

  @IsString()
  @Trim()
  @MaxLength(100)
  shortDescription: string;

  @IsString()
  @Trim()
  @MaxLength(1000)
  content: string;

  @IsString()
  @BlogExist()
  blogId: string;

  blogName: string | null = null;
}
