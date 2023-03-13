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
import { BlogQueryRepository } from '../infrastructure/blog-query-repository';
import { BlogPaginationDto } from './dto/blog.pagination-dto';
import { BlogsService } from '../application/blogs.service';
import { BlogOutPutObject } from './dto/blog.output.object';
import { BlogViewModel } from './dto/blog.view.model';
import { CreateBlogDto } from './dto/create.blog.dto';
import { UpdateBlogDto } from './dto/update.blog.dto';
import { CreatePostForBlogDto } from './dto/create.post.for.blog.dto';
import { PostService } from '../../posts/application/post.service';
import { PostQueryRepository } from '../../posts/infrastructure/post.query.repository';
import { PostOutputObject } from '../../posts/api/dto/post.output.object';
import { PostsPaginationDto } from '../../posts/api/dto/post.pagination.dto';
import { BasicAuthGuard } from '../../../guards/basic-auth.guard';
import { GetUserIdFromBearerToken } from '../../../guards/get-userId-from-bearer-token.guard';
import { UserId } from '../../../decorators/param/user-id.decorator';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@Controller('blogs')
export class BlogsController {
  constructor(
    private blogService: BlogsService,
    private postService: PostService,
    private blogsQueryRepository: BlogQueryRepository,
    private postQueryRepository: PostQueryRepository,
  ) {}

  @Get()
  async getBlogs(
    @Query() blogPaginationDto: BlogPaginationDto,
  ): Promise<BlogOutPutObject> {
    return this.blogsQueryRepository.getAllBlogs(blogPaginationDto);
  }

  @UseGuards(BasicAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createBlog(
    @Body() createBlogDto: CreateBlogDto,
  ): Promise<BlogViewModel> {
    return this.blogService.createBlog(createBlogDto);
  }

  @Get(':id')
  async getBlogById(@Param('id') id: string) {
    const blog = await this.blogsQueryRepository.getBlogById(id);
    if (!blog) throw new NotFoundException();
    return blog;
  }

  @UseGuards(BasicAuthGuard)
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBlogById(
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ) {
    return this.blogService.updateBlogById(id, updateBlogDto);
  }

  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBlogById(@Param('id') id: string) {
    return await this.blogService.deleteBlogByID(id);
  }

  @UseGuards(GetUserIdFromBearerToken)
  @Get(':blogId/posts')
  @HttpCode(HttpStatus.OK)
  async findPostForCertainBlog(
    @Param('blogId') blogId: string,
    @Query() postsPaginationDto: PostsPaginationDto,
    @UserId() userId: string | null,
  ): Promise<PostOutputObject> {
    const blog = await this.blogsQueryRepository.getBlogById(blogId);
    if (!blog) throw new NotFoundException();
    return this.postQueryRepository.findPostByBlogId(
      blogId,
      postsPaginationDto,
      userId,
    );
  }
  @UseGuards(BasicAuthGuard)
  @Post(':blogId/posts')
  async createPostForCertainBlog(
    @Param('blogId') blogId: string,
    @Body() dto: CreatePostForBlogDto,
  ) {
    const blog = await this.blogsQueryRepository.getBlogById(blogId);
    if (!blog) throw new NotFoundException();
    return this.postService.createPostForCertainBlog(dto, blogId, blog.name);
  }
}
