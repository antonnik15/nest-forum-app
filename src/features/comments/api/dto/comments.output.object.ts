import { Comment } from '../../domain/comment.schema';
import { CommentsQueryObj } from './comments.query.obj';

export class CommentsOutputObject {
  private pagesCount: number;
  private page: number;
  private totalCount: number;
  private pageSize: number;
  items: Comment[];
  constructor(queryObj: CommentsQueryObj, commentsArray: any) {
    this.pagesCount = Math.ceil(commentsArray.length / +queryObj.pageSize);
    this.page = +queryObj.pageNumber;
    this.pageSize = +queryObj.pageSize;
    this.totalCount = commentsArray.length;
    this.items = commentsArray;
  }
}
