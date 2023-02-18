import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../domain/entities/blog.shema';
import { Model } from 'mongoose';
import { BlogsQueryObj } from '../api/dto/blogs.query.obj';
import { BlogOutPutObject } from '../api/dto/blog.output.object';

@Injectable()
export class BlogQueryRepository {
  constructor(
    @InjectModel(Blog.name) private blogsModel: Model<BlogDocument>,
  ) {}
  async getAllBlogs(queryObj: BlogsQueryObj): Promise<BlogOutPutObject> {
    let filter = {};
    if (queryObj.searchNameTerm) {
      filter = { name: { $regex: queryObj.searchNameTerm, $options: 'i' } };
    }
    const countDocuments = await this.blogsModel.find(filter).countDocuments();

    const blogsArray = await this.blogsModel
      .find(filter)
      .sort({ [queryObj.sortBy]: queryObj.sortDirection })
      .skip(queryObj.getCountOfSkipElem)
      .limit(+queryObj.pageSize)
      .select(['-_id', '-__v'])
      .exec();

    return new BlogOutPutObject(queryObj, blogsArray, countDocuments);
  }

  async getBlogById(id: string): Promise<Blog> {
    const blog = await this.blogsModel.findOne({ id: id }).select('-_id -__v');
    if (!blog) throw new NotFoundException();
    return blog;
  }
}
