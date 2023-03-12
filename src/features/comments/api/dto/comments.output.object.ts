import { Comment } from '../../domain/comment.schema';
import { CommentsPaginationDto } from './comments.pagination.dto';

export class CommentsOutputObject {
  private pagesCount: number;
  private page: number;
  private totalCount: number;
  private pageSize: number;
  items: Comment[];
  constructor(
    paginationDto: CommentsPaginationDto,
    commentsArray: any,
    countDoc: number,
  ) {
    this.pagesCount = Math.ceil(countDoc / paginationDto.pageSize);
    this.page = paginationDto.pageNumber;
    this.pageSize = paginationDto.pageSize;
    this.totalCount = countDoc;
    this.items = commentsArray;
  }
}
