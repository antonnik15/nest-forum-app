import { Injectable, NotFoundException } from '@nestjs/common';
import { PostQueryObj } from '../api/dto/post.query.obj';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from '../domain/entities/post.schema';
import { Model } from 'mongoose';
import { PostViewModelMapper } from '../../../helpers/post.view.model.mapper';

@Injectable()
export class PostQueryRepository {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    private postViewModelMapper: PostViewModelMapper,
  ) {}
  async getAllPosts(queryObj: PostQueryObj) {
    const posts = await this.postModel
      .find()
      .sort(queryObj.sortDirection)
      .skip(queryObj.getCountOfSkipElem)
      .limit(+queryObj.pageSize)
      .select(['-_id', '-__v'])
      .exec();
    return this.postViewModelMapper.createPostArray(posts);
  }

  async findPostById(id: string) {
    const post = await this.postModel.findOne({ id });
    if (!post) throw new NotFoundException();
    return this.postViewModelMapper.mapPostToViewModel(post);
  }

  async findPostByBlogId(blogId: string, queryObj: PostQueryObj) {
    const posts = await this.postModel
      .find({ blogId: blogId })
      .sort(queryObj.sortDirection)
      .skip(queryObj.getCountOfSkipElem)
      .limit(+queryObj.pageSize)
      .select(['-_id', '-__v'])
      .exec();
    return this.postViewModelMapper.createPostArray(posts);
  }
}
