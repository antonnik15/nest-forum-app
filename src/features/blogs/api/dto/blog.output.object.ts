import { Blog } from '../../domain/entities/blog.shema';
import { BlogsQueryObj } from './blogs.query.obj';

export class BlogOutPutObject {
  private pagesCount: number;
  private page: number;
  private totalCount: number;
  items: Blog[];
  private pageSize: number;
  constructor(queryObj: BlogsQueryObj, blogArray: Blog[]) {
    this.pagesCount = Math.ceil(blogArray.length / +queryObj.pageSize);
    this.page = +queryObj.pageNumber;
    this.pageSize = +queryObj.pageSize;
    this.totalCount = blogArray.length;
    this.items = blogArray;
  }
}
