import { OmitType } from '@nestjs/mapped-types';
import { BlogPaginationDto } from '../../../blogs/api/dto/blog.pagination-dto';

export class PostsPaginationDto extends OmitType(BlogPaginationDto, [
  'searchNameTerm',
]) {
  get getCountOfSkipElem(): number {
    return (this.pageNumber - 1) * this.pageSize;
  }
}
