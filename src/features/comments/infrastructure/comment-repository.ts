import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from '../domain/comment.schema';
import { CommentDtoForDb } from '../api/dto/comment-dto-for-db';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentModel: Model<CommentDocument>,
  ) {}

  async createCommentForCertainPost(
    commentDto: CommentDtoForDb,
  ): Promise<Comment> {
    const comment = new this.commentModel(commentDto);
    return await comment.save();
  }

  async updateCommentById(commentId: string, content: string) {
    await this.commentModel.updateOne({ id: commentId }, { content }).exec();
    return;
  }

  deleteCommentById(commentId: string) {
    return this.commentModel
      .deleteOne({
        id: commentId,
      })
      .exec();
  }
}
