import { UserInfoDto } from '../../../auth/api/dto/user-info.dto';

export class CommentDtoForDb {
  private readonly content: string;
  private readonly parentId: string;
  private readonly parentType: string;
  private readonly userId: string;
  private readonly userLogin: string;
  constructor(postId: string, content: string, userInfo: UserInfoDto) {
    this.content = content;
    this.parentId = postId;
    this.parentType = 'Post';
    this.userId = userInfo.id;
    this.userLogin = userInfo.login;
  }
}
