export class BlogsQueryObj {
  public searchNameTerm: string | null;
  public sortBy;
  public sortDirection;
  public pageNumber;
  public pageSize;

  constructor(query: any) {
    this.pageNumber = query.pageNumber ?? '1';
    this.pageSize = query.pageSize ?? '10';
    this.searchNameTerm = query.searchNameTerm ?? null;
    this.sortBy = query.sortBy ?? 'createdAt';
    this.sortDirection = query.sortDirection ?? 'desc';
  }

  get getCountOfSkipElem() {
    return (+this.pageNumber - 1) * +this.pageSize;
  }
}
