import { Post } from '../features/posts/domain/entities/post.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import {
  Reaction,
  ReactionDocument,
} from '../features/reaction/domain/entities/reaction.schema';

@Injectable()
export class PostViewModelMapper {
  constructor(
    @InjectModel(Reaction.name) private reactionModel: Model<ReactionDocument>,
  ) {}
  async createPostArray(postArray: Post[], userId: string | null) {
    return Promise.all(
      postArray.map((p) => this.mapPostToViewModel(p, userId)),
    );
  }
  async mapPostToViewModel(post: Post, userId: string | null) {
    let myReaction;
    if (userId) {
      myReaction = await this.reactionModel.findOne({
        parentId: post.id,
        userId,
      });
    }
    const lastThreeLikes = await this.reactionModel
      .find({ parentId: post.id, reactionStatus: 'Like' })
      .sort({ addedAt: 'desc' })
      .limit(3)
      .select(['-_id', '-__v', '-parentId', '-reactionStatus']);
    console.log(myReaction);
    return {
      id: post.id,
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
      extendedLikesInfo: {
        likesCount: await this.reactionModel.countDocuments({
          parentId: post.id,
          reactionStatus: 'Like',
        }),
        dislikesCount: await this.reactionModel.countDocuments({
          parentId: post.id,
          reactionStatus: 'Dislike',
        }),
        myStatus: myReaction?.reactionStatus ?? 'None',
        newestLikes: lastThreeLikes,
      },
    };
  }
}
