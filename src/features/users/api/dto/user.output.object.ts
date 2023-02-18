import { UsersQueryObj } from './users.query.obj';
import { UserViewModel } from './user.view.model';

export class UserOutputObject {
  private pagesCount: number;
  private page: number;
  private totalCount: number;
  private pageSize: number;
  items: UserViewModel[];
  constructor(
    queryObj: UsersQueryObj,
    usersArray: UserViewModel[],
    countDoc: number,
  ) {
    this.pagesCount = Math.ceil(countDoc / +queryObj.pageSize);
    this.page = +queryObj.pageNumber;
    this.pageSize = +queryObj.pageSize;
    this.totalCount = countDoc;
    this.items = usersArray;
  }
}
