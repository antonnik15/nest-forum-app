import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from '../domain/entities/post.schema';
import { Model } from 'mongoose';
import { PostViewModelMapper } from '../../../helpers/post.view.model.mapper';
import { PostOutputObject } from '../api/dto/post.output.object';
import { PostsPaginationDto } from '../api/dto/post.pagination.dto';

@Injectable()
export class PostQueryRepository {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    private postViewModelMapper: PostViewModelMapper,
  ) {}
  async getAllPosts(paginationDto: PostsPaginationDto, userId: string | null) {
    const countDocuments = await this.postModel.find().countDocuments();
    const posts = await this.getPostByFilter({}, paginationDto);
    const postsArray = await this.postViewModelMapper.createPostArray(
      posts,
      userId,
    );
    return new PostOutputObject(paginationDto, postsArray, countDocuments);
  }

  async findPostById(id: string) {
    return this.postModel.findOne({ id });
  }

  async findPostByBlogId(
    blogId: string,
    paginationDto: PostsPaginationDto,
    userId: string | null,
  ) {
    const filter = { blogId: blogId };
    const countDocuments = await this.postModel.find(filter).countDocuments();
    const posts = await this.getPostByFilter(filter, paginationDto);

    const postsArray = await this.postViewModelMapper.createPostArray(
      posts,
      userId,
    );
    return new PostOutputObject(paginationDto, postsArray, countDocuments);
  }

  getPostByFilter(filter: any, paginationDto: PostsPaginationDto) {
    return this.postModel
      .find(filter)
      .sort({ [paginationDto.sortBy]: paginationDto.sortDirection })
      .skip(paginationDto.getCountOfSkipElem)
      .limit(paginationDto.pageSize)
      .select(['-_id', '-__v']);
  }
}
