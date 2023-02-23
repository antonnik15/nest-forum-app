import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PostQueryRepository } from '../infrastructure/post.query.repository';
import { CreatePostDto } from './dto/create.post.dto';
import { PostService } from '../application/post.service';
import { UpdatePostDto } from './dto/update.post.dto';
import { CommentsPaginationDto } from '../../comments/api/dto/comments.pagination.dto';
import { CommentQueryRepository } from '../../comments/infrastructure/comment-query-repository.service';
import { CommentsOutputObject } from '../../comments/api/dto/comments.output.object';
import { PostsPaginationDto } from './dto/post.pagination.dto';

@Controller('posts')
export class PostController {
  constructor(
    private postQueryRepository: PostQueryRepository,
    private postService: PostService,
    private commentsQueryRepository: CommentQueryRepository,
  ) {}
  @Get()
  @HttpCode(HttpStatus.OK)
  async getPosts(@Query() postsPaginationDto: PostsPaginationDto) {
    return await this.postQueryRepository.getAllPosts(postsPaginationDto);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createPost(@Body() createPostDto: CreatePostDto) {
    return this.postService.createPost(createPostDto);
  }

  @Get(':id')
  findPostById(@Param('id') id: string) {
    return this.postQueryRepository.findPostById(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePostById(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    await this.postService.updatePostById(updatePostDto, id);
    return;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePostById(@Param('id') id: string) {
    await this.postService.deletePostById(id);
    return;
  }

  @Get(':postId/comments')
  @HttpCode(HttpStatus.OK)
  async findCommentsForCertainPost(
    @Param('postId') postId: string,
    @Query() commentsPaginationDto: CommentsPaginationDto,
  ): Promise<CommentsOutputObject> {
    await this.postQueryRepository.findPostById(postId);
    return await this.commentsQueryRepository.findCommentsByPostId(
      postId,
      commentsPaginationDto,
    );
  }
}
