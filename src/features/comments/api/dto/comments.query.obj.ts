export class CommentsQueryObj {
  public sortBy;
  public sortDirection;
  public pageNumber;
  public pageSize;
  constructor(query: CommentsQueryObj) {
    this.pageNumber = query.pageNumber ?? '1';
    this.pageSize = query.pageSize ?? '10';
    this.sortBy = query.sortBy ?? 'createdAt';
    this.sortDirection = query.sortDirection ?? 'desc';
  }

  get getCountOfSkipElem() {
    return (+this.pageNumber - 1) * +this.pageSize;
  }
}
