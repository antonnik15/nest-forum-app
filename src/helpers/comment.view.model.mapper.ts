import { Injectable } from '@nestjs/common';
import { Comment } from '../features/comments/domain/comment.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Like, LikeDocument } from '../features/likes/like.schema';
import { Model } from 'mongoose';

@Injectable()
export class CommentViewModelMapper {
  constructor(
    @InjectModel(Like.name) private likesModel: Model<LikeDocument>,
  ) {}
  async createCommentsArray(comments: Comment[]) {
    return Promise.all(comments.map((c) => this.mapCommentToViewModel(c)));
  }
  async mapCommentToViewModel(comment: Comment) {
    return {
      id: comment.id,
      content: comment.content,
      commentatorInfo: {
        userId: comment.userId,
        userLogin: comment.userLogin,
      },
      createdAt: comment.createdAt,
      likesInfo: {
        likesCount: await this.likesModel.countDocuments({
          parentId: comment.id,
        }),
        dislikesCount: await this.likesModel.countDocuments({
          parentId: comment.id,
        }),
        myStatus: 'None',
      },
    };
  }
}
