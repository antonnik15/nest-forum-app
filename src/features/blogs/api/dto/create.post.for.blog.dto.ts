export class CreatePostForBlogDto {
  public title: string;
  public shortDescription: string;
  public content: string;
  public blogId: string;
  public blogName: string = null;
}
