import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../domain/entities/blog.shema';
import { Model } from 'mongoose';
import { BlogsQueryObj } from '../api/dto/blogs.query.obj';

@Injectable()
export class BlogQueryRepository {
  constructor(
    @InjectModel(Blog.name) private blogsModel: Model<BlogDocument>,
  ) {}
  getAllBlogs(queryObj: BlogsQueryObj): Promise<Blog[]> {
    let filter = {};
    if (queryObj.searchNameTerm) {
      filter = { name: { $regex: queryObj.searchNameTerm, $options: 'i' } };
    }

    return this.blogsModel
      .find(filter)
      .sort(queryObj.sortDirection)
      .skip(queryObj.getCountOfSkipElem)
      .limit(+queryObj.pageSize)
      .select(['-_id', '-__v'])
      .exec();
  }

  async getBlogById(id: string): Promise<Blog> {
    return this.blogsModel.findOne({ id: id }).select('-_id -__v');
  }
}
