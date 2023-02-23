import { UserPaginationDto } from './user.pagination.dto';
import { UserViewModel } from './user.view.model';

export class UserOutputObject {
  private pagesCount: number;
  private page: number;
  private totalCount: number;
  private pageSize: number;
  items: UserViewModel[];
  constructor(
    paginationDto: UserPaginationDto,
    usersArray: UserViewModel[],
    countDoc: number,
  ) {
    this.pagesCount = Math.ceil(countDoc / paginationDto.pageSize);
    this.page = paginationDto.pageNumber;
    this.pageSize = paginationDto.pageSize;
    this.totalCount = countDoc;
    this.items = usersArray;
  }
}
