import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommentQueryRepository } from '../infrastructure/comment-query-repository';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { BearerAuthGuard } from '../../../guards/bearer-auth.guard';
import { UserInfo } from '../../../decorators/param/user-info.decorator';
import { UserInfoDto } from '../../auth/api/dto/user-info.dto';
import { CommentService } from '../application/comments.service';
import { ReactionStatusDto } from '../../reaction/api/dto/reaction-status.dto';
import { CommentViewModelMapper } from '../../../helpers/comment.view.model.mapper';

@Controller('comments')
export class CommentController {
  constructor(
    private commentsQueryRepository: CommentQueryRepository,
    private readonly commentService: CommentService,
    private readonly commentViewModelMapper: CommentViewModelMapper,
  ) {}

  @UseGuards(BearerAuthGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findCommentById(
    @Param('id') id: string,
    @UserInfo() user: UserInfoDto,
  ) {
    const comment = await this.commentsQueryRepository.findCommentById(id);
    if (!comment) throw new NotFoundException();
    return this.commentViewModelMapper.mapCommentToViewModel(comment, user.id);
  }

  @UseGuards(BearerAuthGuard)
  @Put(':commentId/like-status')
  @HttpCode(HttpStatus.NO_CONTENT)
  changeReactionForComment(
    @Param('commentId') commentId: string,
    @Body() reactionDto: ReactionStatusDto,
    @UserInfo() user: UserInfoDto,
  ) {
    return this.commentService.changeReactionForComment(
      commentId,
      user.id,
      user.login,
      reactionDto.likeStatus,
    );
  }

  @UseGuards(BearerAuthGuard)
  @Put(':commentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  updateCommentById(
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @UserInfo() user: UserInfoDto,
  ) {
    return this.commentService.updateCommentById(
      commentId,
      updateCommentDto.content,
      user.id,
    );
  }

  @UseGuards(BearerAuthGuard)
  @Delete(':commentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteCommentById(
    @Param('commentId') commentId: string,
    @UserInfo() user: UserInfoDto,
  ) {
    return this.commentService.deleteCommentById(commentId, user.id);
  }
}
