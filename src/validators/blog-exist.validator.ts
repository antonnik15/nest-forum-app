import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { BlogQueryRepository } from '../features/blogs/infrastructure/blog-query-repository';

@ValidatorConstraint({ name: 'BlogExist', async: true })
@Injectable()
export class BlogExistValidator implements ValidatorConstraintInterface {
  constructor(private readonly blogQueryRepository: BlogQueryRepository) {}
  async validate(blogId: string): Promise<boolean> {
    try {
      const blog = await this.blogQueryRepository.getBlogById(blogId);
      return !!blog;
    } catch (err) {
      return false;
    }
  }

  defaultMessage(): string {
    return 'Blog does not exist';
  }
}
