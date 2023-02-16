import { Post } from '../features/posts/domain/entities/post.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Like, LikeDocument } from '../features/likes/like.schema';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostViewModelMapper {
  constructor(
    @InjectModel(Like.name) private likesModel: Model<LikeDocument>,
  ) {}
  async createPostArray(postArray: Post[]) {
    return Promise.all(postArray.map((p) => this.mapPostToViewModel(p)));
  }
  async mapPostToViewModel(post: Post) {
    return {
      id: post.id,
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
      extendedLikesInfo: {
        likesCount: await this.likesModel.countDocuments({ parentId: post.id }),
        dislikesCount: await this.likesModel.countDocuments({
          parentId: post.id,
        }),
        myStatus: 'None',
        newestLikes: [],
      },
    };
  }
}
