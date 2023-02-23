import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class CreateBlogDto {
  @IsString()
  @MaxLength(15)
  @IsNotEmpty()
  public name: string;

  @IsString()
  @MaxLength(500)
  public description: string;

  @IsString()
  @MaxLength(100)
  @Matches(
    '^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$',
  )
  public websiteUrl: string;
}
