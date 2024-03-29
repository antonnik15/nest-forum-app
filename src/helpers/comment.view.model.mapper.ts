import { Injectable } from '@nestjs/common';
import { Comment } from '../features/comments/domain/comment.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Reaction,
  ReactionDocument,
} from '../features/reaction/domain/entities/reaction.schema';

@Injectable()
export class CommentViewModelMapper {
  constructor(
    @InjectModel(Reaction.name) private reactionModel: Model<ReactionDocument>,
  ) {}
  async createCommentsArray(comments: Comment[], userId: string | null) {
    return Promise.all(
      comments.map((c) => this.mapCommentToViewModel(c, userId)),
    );
  }
  async mapCommentToViewModel(comment: Comment, userId: string | null) {
    let myReaction;
    if (userId) {
      myReaction = await this.reactionModel.findOne({
        parentId: comment.id,
        userId,
      });
    }
    return {
      id: comment.id,
      content: comment.content,
      commentatorInfo: {
        userId: comment.userId,
        userLogin: comment.userLogin,
      },
      createdAt: comment.createdAt,
      likesInfo: {
        likesCount: await this.reactionModel.countDocuments({
          parentId: comment.id,
          reactionStatus: 'Like',
        }),
        dislikesCount: await this.reactionModel.countDocuments({
          parentId: comment.id,
          reactionStatus: 'Dislike',
        }),
        myStatus: myReaction?.reactionStatus ?? 'None',
      },
    };
  }
}
