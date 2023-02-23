import { OmitType } from '@nestjs/mapped-types';
import { BlogPaginationDto } from '../../../blogs/api/dto/blog.pagination-dto';

export class CommentsPaginationDto extends OmitType(BlogPaginationDto, [
  'searchNameTerm',
]) {
  get getCountOfSkipElem() {
    return (this.pageNumber - 1) * this.pageSize;
  }
}
