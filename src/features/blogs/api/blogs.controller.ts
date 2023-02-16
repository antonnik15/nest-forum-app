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
import { BlogQueryRepository } from '../infrastructure/blog-query-repository.service';
import { BlogsQueryObj } from './dto/blogs.query.obj';
import { BlogsService } from '../application/blogs.service';
import { BlogOutPutObject } from './dto/blog.output.object';
import { BlogViewModel } from './dto/blog.view.model';
import { CreateBlogDto } from './dto/create.blog.dto';
import { UpdateBlogDto } from './dto/update.blog.dto';
import { CreatePostForBlogDto } from './dto/create.post.for.blog.dto';
import { PostService } from '../../posts/application/post.service';
import { PostQueryRepository } from '../../posts/infrastructure/post.query.repository';
import { PostQueryObj } from '../../posts/api/dto/post.query.obj';
import { PostOutputObject } from '../../posts/api/dto/post.output.object';

@Controller('blogs')
export class BlogsController {
  constructor(
    private blogService: BlogsService,
    private postService: PostService,
    private blogsQueryRepository: BlogQueryRepository,
    private postQueryRepository: PostQueryRepository,
  ) {}

  @Get()
  async getBlogs(@Query() query: BlogsQueryObj): Promise<BlogOutPutObject> {
    const queryObj: BlogsQueryObj = new BlogsQueryObj(query);
    return await this.blogsQueryRepository.getAllBlogs(queryObj);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createBlog(@Body() dto: CreateBlogDto): Promise<BlogViewModel> {
    return await this.blogService.createBlog(dto);
  }

  @Get(':id')
  async getBlogById(@Param('id') id: string) {
    return await this.blogsQueryRepository.getBlogById(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBlogById(@Param('id') id: string, @Body() dto: UpdateBlogDto) {
    await this.blogService.updateBlogById(id, dto);
    return;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBlogById(@Param('id') id: string) {
    return await this.blogService.deleteBlogByID(id);
  }

  @Get(':blogId/posts')
  @HttpCode(HttpStatus.OK)
  async findPostForCertainBlog(
    @Param('blogId') blogId: string,
    @Query() query: PostQueryObj,
  ): Promise<PostOutputObject> {
    const blog = await this.blogsQueryRepository.getBlogById(blogId);
    if (!blog) throw new NotFoundException();
    const queryObj: PostQueryObj = new PostQueryObj(query);
    return await this.postQueryRepository.findPostByBlogId(blogId, queryObj);
  }

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
