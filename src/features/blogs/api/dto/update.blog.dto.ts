import { CreateBlogDto } from './create.blog.dto';
import { PickType } from '@nestjs/mapped-types';

export class UpdateBlogDto extends PickType(CreateBlogDto, [
  'name',
  'description',
  'websiteUrl',
]) {}
