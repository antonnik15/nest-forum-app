import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../domain/entities/blog.shema';
import { Model } from 'mongoose';
import { BlogOutPutObject } from '../api/dto/blog.output.object';
import { BlogPaginationDto } from '../api/dto/blog.pagination-dto';

@Injectable()
export class BlogQueryRepository {
  constructor(
    @InjectModel(Blog.name) private blogsModel: Model<BlogDocument>,
  ) {}
  async getAllBlogs(
    paginationDto: BlogPaginationDto,
  ): Promise<BlogOutPutObject> {
    let filter = {};
    if (paginationDto.searchNameTerm) {
      filter = {
        name: { $regex: paginationDto.searchNameTerm, $options: 'i' },
      };
    }
    const countDocuments = await this.blogsModel.find(filter).countDocuments();

    const blogsArray = await this.blogsModel
      .find(filter)
      .sort({ [paginationDto.sortBy]: paginationDto.sortDirection })
      .skip(paginationDto.getCountOfSkipElem)
      .limit(paginationDto.pageSize)
      .select(['-_id', '-__v'])
      .exec();

    return new BlogOutPutObject(paginationDto, blogsArray, countDocuments);
  }

  getBlogById(id: string) {
    return this.blogsModel.findOne({ id: id }).select('-_id -__v');
  }
}
