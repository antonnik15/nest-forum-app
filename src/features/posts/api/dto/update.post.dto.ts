import { PickType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create.post.dto';

export class UpdatePostDto extends PickType(CreatePostDto, [
  'title',
  'shortDescription',
  'content',
  'blogId',
  'blogName',
]) {}
