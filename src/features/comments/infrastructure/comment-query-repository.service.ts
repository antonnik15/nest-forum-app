import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from '../domain/comment.schema';
import { Model } from 'mongoose';
import { CommentViewModelMapper } from '../../../helpers/comment.view.model.mapper';
import { CommentsPaginationDto } from '../api/dto/comments.pagination.dto';
import { CommentsOutputObject } from '../api/dto/comments.output.object';

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

  async findCommentsByPostId(
    postId: string,
    paginationDto: CommentsPaginationDto,
  ) {
    const countDocuments = await this.commentsModel
      .find({ parentId: postId })
      .countDocuments();

    const commentsArray = await this.commentsModel
      .find({ parentId: postId })
      .sort({ [paginationDto.sortBy]: paginationDto.sortDirection })
      .skip(paginationDto.getCountOfSkipElem)
      .limit(paginationDto.pageSize)
      .select(['-_id', '-__v'])
      .exec();
    return new CommentsOutputObject(
      paginationDto,
      commentsArray,
      countDocuments,
    );
  }
}
