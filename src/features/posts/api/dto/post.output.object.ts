import { PostQueryObj } from './post.query.obj';
import { Post } from '../../domain/entities/post.schema';

export class PostOutputObject {
  private pagesCount: number;
  private page: number;
  private totalCount: number;
  private pageSize: number;
  items: Post[];
  constructor(queryObj: PostQueryObj, postsArray: any) {
    this.pagesCount = Math.ceil(postsArray.length / +queryObj.pageSize);
    this.page = +queryObj.pageNumber;
    this.pageSize = +queryObj.pageSize;
    this.totalCount = postsArray.length;
    this.items = postsArray;
  }
}
