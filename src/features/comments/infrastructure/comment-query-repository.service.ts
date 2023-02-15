import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from '../domain/comment.schema';
import { Model } from 'mongoose';
import { CommentsQueryObj } from '../api/dto/comments.query.obj';
import { CommentViewModelMapper } from '../../../helpers/comment.view.model.mapper';

@Injectable()
export class CommentQueryRepository {
  constructor(
    @InjectModel(Comment.name) private commentsModel: Model<CommentDocument>,
    private commentViewModelMapper: CommentViewModelMapper,
  ) {}
  async findCommentById(id: string) {
    const comment = await this.commentsModel.findOne({ id });
    if (!comment) throw new NotFoundException();
    return this.commentViewModelMapper.mapCommentToViewModel(comment);
  }

  async findCommentsByPostId(postId: string, queryObj: CommentsQueryObj) {
    const comments = await this.commentsModel
      .find({ parentId: postId })
      .sort(queryObj.sortDirection)
      .skip(queryObj.getCountOfSkipElem)
      .limit(+queryObj.pageSize)
      .select(['-_id', '-__v'])
      .exec();
    return this.commentViewModelMapper.createCommentsArray(comments);
  }
}
