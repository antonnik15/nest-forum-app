import { IsString, Length } from 'class-validator';

export class CreatePostForBlogDto {
  @IsString()
  @Length(1, 30)
  public title: string;

  @IsString()
  @Length(1, 100)
  public shortDescription: string;

  @IsString()
  @Length(1000)
  public content: string;

  public blogId: string | null = null;
  public blogName: string | null = null;
}
