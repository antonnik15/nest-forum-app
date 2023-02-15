import { BlogRepository } from '../infrastructure/blog-repository.service';
import { Injectable } from '@nestjs/common';
import { CreateBlogDto } from '../api/dto/create.blog.dto';
import { UpdateBlogDto } from '../api/dto/update.blog.dto';
import { BlogViewModel } from '../api/dto/blog.view.model';

@Injectable()
export class BlogsService {
  constructor(private readonly blogsRepository: BlogRepository) {}

  async createBlog(dto: CreateBlogDto): Promise<BlogViewModel> {
    const blog = await this.blogsRepository.createBlog(dto);
    return {
      id: blog.id,
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt,
      isMembership: blog.isMembership,
    };
  }

  async updateBlogById(id: string, dto: UpdateBlogDto) {
    await this.blogsRepository.updateBlogById(id, dto);
    return;
  }

  async deleteBlogByID(id: string): Promise<boolean> {
    return await this.blogsRepository.deleteBlogById(id);
  }
}
