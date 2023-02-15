export class UsersQueryObj {
  public sortBy;
  public sortDirection;
  public pageNumber;
  public pageSize;
  public searchLoginTerm;
  public searchEmailTerm;
  constructor(query: UsersQueryObj) {
    this.pageNumber = query.pageNumber ?? '1';
    this.pageSize = query.pageSize ?? '10';
    this.sortBy = query.sortBy ?? 'createdAt';
    this.sortDirection = query.sortDirection ?? 'desc';
    this.searchLoginTerm = query.searchLoginTerm ?? null;
    this.searchEmailTerm = query.searchEmailTerm ?? null;
  }

  get getCountOfSkipElem() {
    return (+this.pageNumber - 1) * +this.pageSize;
  }
}
