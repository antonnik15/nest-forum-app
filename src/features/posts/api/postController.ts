import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PostQueryObj } from './dto/post.query.obj';
import { PostQueryRepository } from '../infrastructure/post.query.repository';
import { CreatePostDto } from './dto/create.post.dto';
import { PostService } from '../application/post.service';
import { UpdatePostDto } from './dto/update.post.dto';
import { CommentsQueryObj } from '../../comments/api/dto/comments.query.obj';
import { CommentQueryRepository } from '../../comments/infrastructure/comment-query-repository.service';
import { CommentsOutputObject } from '../../comments/api/dto/comments.output.object';

@Controller('posts')
export class PostController {
  constructor(
    private postQueryRepository: PostQueryRepository,
    private postService: PostService,
    private commentsQueryRepository: CommentQueryRepository,
  ) {}
  @Get()
  @HttpCode(HttpStatus.OK)
  async getPosts(@Query() query: PostQueryObj) {
    const queryObj = new PostQueryObj(query);
    return await this.postQueryRepository.getAllPosts(queryObj);
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
  async updatePostById(@Param('id') id: string, @Body() dto: UpdatePostDto) {
    await this.postService.updatePostById(dto, id);
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
    @Query() query: CommentsQueryObj,
  ) {
    const post = await this.postQueryRepository.findPostById(postId);
    if (!post) throw new NotFoundException();
    const queryObj = new CommentsQueryObj(query);
    const commentsArray =
      await this.commentsQueryRepository.findCommentsByPostId(postId, queryObj);
    return new CommentsOutputObject(queryObj, commentsArray);
  }
}
