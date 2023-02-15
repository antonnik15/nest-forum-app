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
    const postsReq = this.postModel.find();
    const countDocuments = await postsReq.countDocuments();
    const posts = await postsReq
      .sort(queryObj.sortDirection)
      .skip(queryObj.getCountOfSkipElem)
      .limit(+queryObj.pageSize)
      .select(['-_id', '-__v'])
      .exec();
    return this.postViewModelMapper.createPostArray(posts, countDocuments);
  }

  async findPostById(id: string) {
    const post = await this.postModel.findOne({ id });
    if (!post) throw new NotFoundException();
    return this.postViewModelMapper.mapPostToViewModel(post);
  }

  async findPostByBlogId(blogId: string, queryObj: PostQueryObj) {
    const postsReq = this.postModel.find({ blogId: blogId });
    const countDocuments = await postsReq.countDocuments();
    const posts = await postsReq
      .sort(queryObj.sortDirection)
      .skip(queryObj.getCountOfSkipElem)
      .limit(+queryObj.pageSize)
      .select(['-_id', '-__v'])
      .exec();
    return this.postViewModelMapper.createPostArray(posts, countDocuments);
  }
}
