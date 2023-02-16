import { Blog } from '../../domain/entities/blog.shema';
import { BlogsQueryObj } from './blogs.query.obj';

export class BlogOutPutObject {
  private pagesCount: number;
  private page: number;
  private totalCount: number;
  items: Blog[];
  private pageSize: number;
  constructor(queryObj: BlogsQueryObj, blogArray: Blog[], countDoc: number) {
    this.pagesCount = Math.ceil(countDoc / +queryObj.pageSize);
    this.page = +queryObj.pageNumber;
    this.pageSize = +queryObj.pageSize;
    this.totalCount = countDoc;
    this.items = blogArray;
  }
}
