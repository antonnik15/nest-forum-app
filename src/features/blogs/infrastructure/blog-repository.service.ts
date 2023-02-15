import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../domain/entities/blog.shema';
import { Model } from 'mongoose';
import { UpdateBlogDto } from '../api/dto/update.blog.dto';
import { CreateBlogDto } from '../api/dto/create.blog.dto';

@Injectable()
export class BlogRepository {
  constructor(
    @InjectModel(Blog.name) private blogsModel: Model<BlogDocument>,
  ) {}
  createBlog(dto: CreateBlogDto): Promise<Blog> {
    const createdBlog = new this.blogsModel(dto);
    return createdBlog.save();
  }
  async updateBlogById(id: string, dto: UpdateBlogDto): Promise<undefined> {
    const blog = await this.blogsModel.findOne({ id: id });
    if (!blog) {
      throw new NotFoundException();
    }
    blog.updateBlog(dto);
    blog.save();
    return;
  }
  async deleteBlogById(id: string): Promise<undefined> {
    const blog = await this.blogsModel.findOne({ id: id });
    if (!blog) throw new NotFoundException();
    await blog.remove();
    return;
  }
}
