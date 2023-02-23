import { Blog } from '../../domain/entities/blog.shema';
import { PostsPaginationDto } from '../../../posts/api/dto/post.pagination.dto';

export class BlogOutPutObject {
  private pagesCount: number;
  private page: number;
  private totalCount: number;
  items: Blog[];
  private pageSize: number;
  constructor(
    paginationDto: PostsPaginationDto,
    blogArray: Blog[],
    countDoc: number,
  ) {
    this.pagesCount = Math.ceil(countDoc / paginationDto.pageSize);
    this.page = paginationDto.pageNumber;
    this.pageSize = paginationDto.pageSize;
    this.totalCount = countDoc;
    this.items = blogArray;
  }
}
