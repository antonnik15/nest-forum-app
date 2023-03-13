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
  UseGuards,
} from '@nestjs/common';
import { PostQueryRepository } from '../infrastructure/post.query.repository';
import { CreatePostDto } from './dto/create.post.dto';
import { PostService } from '../application/post.service';
import { UpdatePostDto } from './dto/update.post.dto';
import { CommentsPaginationDto } from '../../comments/api/dto/comments.pagination.dto';
import { CommentQueryRepository } from '../../comments/infrastructure/comment-query-repository';
import { CommentsOutputObject } from '../../comments/api/dto/comments.output.object';
import { PostsPaginationDto } from './dto/post.pagination.dto';
import { BearerAuthGuard } from '../../../guards/bearer-auth.guard';
import { BasicAuthGuard } from '../../../guards/basic-auth.guard';
import { CreateCommentDto } from '../../comments/api/dto/create-comment-dto';
import { CommentService } from '../../comments/application/comments.service';
import { UserInfo } from '../../../decorators/param/user-info.decorator';
import { UserInfoDto } from '../../auth/api/dto/user-info.dto';
import { ReactionStatusDto } from '../../reaction/api/dto/reaction-status.dto';
import { ReactionService } from '../../reaction/application/reaction.service';
import { PostViewModelMapper } from '../../../helpers/post.view.model.mapper';
import { GetUserIdFromBearerToken } from '../../../guards/get-userId-from-bearer-token.guard';
import { UserId } from '../../../decorators/param/user-id.decorator';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@Controller('posts')
export class PostController {
  constructor(
    private readonly postQueryRepository: PostQueryRepository,
    private readonly postService: PostService,
    private readonly commentsQueryRepository: CommentQueryRepository,
    private readonly commentsService: CommentService,
    private readonly reactionService: ReactionService,
    private readonly postViewModelMapper: PostViewModelMapper,
  ) {}

  @UseGuards(GetUserIdFromBearerToken)
  @Get()
  @HttpCode(HttpStatus.OK)
  async getPosts(
    @Query() postsPaginationDto: PostsPaginationDto,
    @UserId() userId: string | null,
  ) {
    return await this.postQueryRepository.getAllPosts(
      postsPaginationDto,
      userId,
    );
  }

  @UseGuards(BasicAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  createPost(@Body() createPostDto: CreatePostDto) {
    return this.postService.createPost(createPostDto);
  }

  @UseGuards(GetUserIdFromBearerToken)
  @Get(':id')
  async findPostById(@Param('id') id: string, @UserId() userId: string | null) {
    const post = await this.postQueryRepository.findPostById(id);
    if (!post) throw new NotFoundException();
    return this.postViewModelMapper.mapPostToViewModel(post, userId);
  }

  @UseGuards(BasicAuthGuard)
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePostById(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    await this.postService.updatePostById(updatePostDto, id);
    return;
  }

  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePostById(@Param('id') id: string) {
    await this.postService.deletePostById(id);
    return;
  }

  @UseGuards(GetUserIdFromBearerToken)
  @Get(':postId/comments')
  @HttpCode(HttpStatus.OK)
  async findCommentsForCertainPost(
    @Param('postId') postId: string,
    @Query() commentsPaginationDto: CommentsPaginationDto,
    @UserId() userId: string | null,
  ): Promise<CommentsOutputObject> {
    const post = await this.postQueryRepository.findPostById(postId);
    if (!post) throw new NotFoundException();
    return this.commentsQueryRepository.findCommentsByPostId(
      post.id,
      commentsPaginationDto,
      userId,
    );
  }

  @UseGuards(BearerAuthGuard)
  @Post(':postId/comments')
  async createCommentForPost(
    @Param('postId') postId: string,
    @Body() createCommentDto: CreateCommentDto,
    @UserInfo() userInfo: UserInfoDto,
  ) {
    return this.commentsService.createCommentForCertainPost(
      postId,
      createCommentDto.content,
      userInfo,
    );
  }

  @UseGuards(BearerAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':postId/like-status')
  async createReactionOnPost(
    @Param('postId') postId: string,
    @Body() likeStatusDto: ReactionStatusDto,
    @UserInfo() userInfo: UserInfoDto,
  ) {
    const post = await this.postQueryRepository.findPostById(postId);
    if (!post) throw new NotFoundException();
    return this.reactionService.updateReactionByParenId(
      postId,
      userInfo.id,
      userInfo.login,
      likeStatusDto.likeStatus,
    );
  }
}
