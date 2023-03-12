import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';
import { Trim } from '../../../../decorators/validation/trim.decorator';

export class CreateBlogDto {
  @IsString()
  @Trim()
  @MaxLength(15)
  @IsNotEmpty()
  public name: string;

  @IsString()
  @Trim()
  @MaxLength(500)
  public description: string;

  @IsString()
  @Trim()
  @MaxLength(100)
  @Matches(
    '^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$',
  )
  public websiteUrl: string;
}
