import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { CommentQueryRepository } from '../infrastructure/comment-query-repository.service';

@Controller('comments')
export class CommentController {
  constructor(private commentsQueryRepository: CommentQueryRepository) {}
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findCommentById(@Param('id') id: string) {
    return this.commentsQueryRepository.findCommentById(id);
  }
}
