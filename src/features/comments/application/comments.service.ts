import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserInfoDto } from '../../auth/api/dto/user-info.dto';
import { CommentDtoForDb } from '../api/dto/comment-dto-for-db';
import { CommentRepository } from '../infrastructure/comment-repository';
import { PostQueryRepository } from '../../posts/infrastructure/post.query.repository';
import { CommentViewModelMapper } from '../../../helpers/comment.view.model.mapper';
import { CommentQueryRepository } from '../infrastructure/comment-query-repository';
import { ReactionStatusEnum } from '../../reaction/domain/entities/reaction.schema';
import { ReactionService } from '../../reaction/application/reaction.service';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly commentQueryRepository: CommentQueryRepository,
    private readonly postQueryRepository: PostQueryRepository,
    private readonly commentViewModelMapper: CommentViewModelMapper,
    private readonly reactionService: ReactionService,
  ) {}

  async createCommentForCertainPost(
    postId: string,
    content: string,
    userInfo: UserInfoDto,
  ) {
    const post = await this.postQueryRepository.findPostById(postId);
    if (!post) throw new NotFoundException();
    const commentDto: CommentDtoForDb = new CommentDtoForDb(
      postId,
      content,
      userInfo,
    );
    const comment = await this.commentRepository.createCommentForCertainPost(
      commentDto,
    );
    return this.commentViewModelMapper.mapCommentToViewModel(
      comment,
      userInfo.id,
    );
  }

  async updateCommentById(commentId: string, content: string, userId: string) {
    const comment = await this.commentQueryRepository.findCommentById(
      commentId,
    );
    if (!comment) throw new NotFoundException();
    if (comment.userId !== userId) throw new ForbiddenException();
    return this.commentRepository.updateCommentById(commentId, content);
  }

  async deleteCommentById(commentId: string, userId: string) {
    const comment = await this.commentQueryRepository.findCommentById(
      commentId,
    );
    if (!comment) throw new NotFoundException();
    if (comment.userId !== userId) throw new ForbiddenException();
    return this.commentRepository.deleteCommentById(commentId);
  }

  async changeReactionForComment(
    commentId: string,
    userId: string,
    userLogin: string,
    likeStatus: ReactionStatusEnum,
  ) {
    const comment = await this.commentQueryRepository.findCommentById(
      commentId,
    );
    if (!comment) throw new NotFoundException();
    return this.reactionService.updateReactionByParenId(
      commentId,
      userId,
      userLogin,
      likeStatus,
    );
  }
}
