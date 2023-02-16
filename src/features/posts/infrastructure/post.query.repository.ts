import { Injectable, NotFoundException } from '@nestjs/common';
import { PostQueryObj } from '../api/dto/post.query.obj';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from '../domain/entities/post.schema';
import { Model } from 'mongoose';
import { PostViewModelMapper } from '../../../helpers/post.view.model.mapper';
import { PostOutputObject } from '../api/dto/post.output.object';

@Injectable()
export class PostQueryRepository {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    private postViewModelMapper: PostViewModelMapper,
  ) {}
  async getAllPosts(queryObj: PostQueryObj) {
    const countDocuments = await this.postModel.find().countDocuments();
    const posts = await this.getPostByFilter({}, queryObj);
    const postsArray = await this.postViewModelMapper.createPostArray(posts);
    return new PostOutputObject(queryObj, postsArray, countDocuments);
  }

  async findPostById(id: string) {
    const post = await this.postModel.findOne({ id });
    if (!post) throw new NotFoundException();
    return this.postViewModelMapper.mapPostToViewModel(post);
  }

  async findPostByBlogId(blogId: string, queryObj: PostQueryObj) {
    const filter = { blogId: blogId };
    const countDocuments = await this.postModel.find(filter).countDocuments();
    const posts = await this.getPostByFilter(filter, queryObj);

    const postsArray = await this.postViewModelMapper.createPostArray(posts);
    return new PostOutputObject(queryObj, postsArray, countDocuments);
  }

  getPostByFilter(filter: any, queryObj: PostQueryObj) {
    return this.postModel
      .find(filter)
      .sort(queryObj.sortDirection)
      .skip(queryObj.getCountOfSkipElem)
      .limit(+queryObj.pageSize)
      .select(['-_id', '-__v']);
  }
}
