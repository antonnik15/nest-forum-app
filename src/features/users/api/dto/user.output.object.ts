import { UsersQueryObj } from './users.query.obj';
import { UserViewModel } from './user.view.model';

export class UserOutputObject {
  private pagesCount: number;
  private page: number;
  private totalCount: number;
  private pageSize: number;
  items: UserViewModel[];
  constructor(queryObj: UsersQueryObj, usersArray: UserViewModel[]) {
    this.pagesCount = Math.ceil(usersArray.length / +queryObj.pageSize);
    this.page = +queryObj.pageNumber;
    this.pageSize = +queryObj.pageSize;
    this.totalCount = usersArray.length;
    this.items = usersArray;
  }
}
