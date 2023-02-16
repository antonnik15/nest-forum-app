import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from '../api/dto/create.post.dto';
import { PostRepository } from '../infrastructure/post.repository';
import { BlogQueryRepository } from '../../blogs/infrastructure/blog-query-repository.service';
import { UpdatePostDto } from '../api/dto/update.post.dto';
import { CreatePostForBlogDto } from '../../blogs/api/dto/create.post.for.blog.dto';

@Injectable()
export class PostService {
  constructor(
    private postRepository: PostRepository,
    private blogsQueryRepository: BlogQueryRepository,
  ) {}
  async createPost(dto: CreatePostDto) {
    await this.addBlogNameToDto(dto);
    const post = await this.postRepository.createPost(dto);
    return post.createPostViewModel();
  }
  async updatePostById(dto: UpdatePostDto, id: string) {
    await this.addBlogNameToDto(dto);
    await this.postRepository.updatePostById(dto, id);
    return;
  }

  deletePostById(id: string) {
    return this.postRepository.deletePostById(id);
  }

  async createPostForCertainBlog(
    dto: CreatePostForBlogDto,
    blogId: string,
    blogName: string,
  ) {
    dto.blogId = blogId;
    dto.blogName = blogName;
    const post = await this.postRepository.createPost(dto);
    return post.createPostViewModel();
  }

  async addBlogNameToDto(dto: CreatePostDto | UpdatePostDto) {
    const blogById = await this.blogsQueryRepository.getBlogById(dto.blogId);
    if (!blogById) throw new NotFoundException();
    dto.blogName = blogById.name;
    dto.blogId = blogById.id;
  }
}
