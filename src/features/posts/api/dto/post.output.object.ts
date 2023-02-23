import { Post } from '../../domain/entities/post.schema';
import { PostsPaginationDto } from './post.pagination.dto';

export class PostOutputObject {
  private pagesCount: number;
  private page: number;
  private totalCount: number;
  private pageSize: number;
  items: Post[];
  constructor(
    paginationDto: PostsPaginationDto,
    postsArray: any,
    countDoc: number,
  ) {
    this.pagesCount = Math.ceil(countDoc / paginationDto.pageSize);
    this.page = paginationDto.pageNumber;
    this.pageSize = paginationDto.pageSize;
    this.totalCount = countDoc;
    this.items = postsArray;
  }
}
