import { IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import {
  checkSortDirection,
  toNumber,
} from '../../../../helpers/pagination-helpers';
import { SortOrder } from 'mongoose';

export class UserPaginationDto {
  @IsOptional()
  @Transform(({ value }) => toNumber(value, { min: 1, default: 1 }))
  @IsNumber()
  pageNumber: number | null = 1;

  @IsOptional()
  @Transform(({ value }) => toNumber(value, { min: 1, default: 10 }))
  @IsNumber()
  pageSize: number | null = 10;

  @IsOptional()
  sortBy: string | null = 'createdAt';

  @IsOptional()
  @Transform(({ value }) => checkSortDirection(value))
  sortDirection: SortOrder = 'desc';

  @IsOptional()
  searchLoginTerm: string | null = null;

  @IsOptional()
  searchEmailTerm: string | null = null;

  get getCountOfSkipElem() {
    return (this.pageNumber - 1) * this.pageSize;
  }
}
