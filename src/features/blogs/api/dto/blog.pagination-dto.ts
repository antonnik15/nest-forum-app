import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import {
  checkSortDirection,
  toNumber,
} from '../../../../helpers/pagination-helpers';
import { SortOrder } from 'mongoose';

export class BlogPaginationDto {
  @IsOptional()
  searchNameTerm: string | null = null;

  @IsOptional()
  sortBy: string | null = 'createdAt';

  @IsOptional()
  @Transform(({ value }) => checkSortDirection(value))
  @IsString()
  sortDirection: SortOrder = 'desc';

  @IsOptional()
  @Transform(({ value }) => toNumber(value, { min: 1, default: 1 }))
  @IsNumber()
  pageNumber: number | null = 1;

  @IsOptional()
  @Transform(({ value }) => toNumber(value, { min: 1, default: 10 }))
  @IsNumber()
  pageSize: number | null = 10;

  get getCountOfSkipElem(): number {
    return (this.pageNumber - 1) * this.pageSize;
  }
}
