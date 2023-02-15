import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from '../domain/entities/post.schema';
import { Model } from 'mongoose';
import { CreatePostDto } from '../api/dto/create.post.dto';
import { UpdatePostDto } from '../api/dto/update.post.dto';
import { CreatePostForBlogDto } from '../../blogs/api/dto/create.post.for.blog.dto';

@Injectable()
export class PostRepository {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  createPost(dto: CreatePostDto | CreatePostForBlogDto): Promise<Post> {
    const post = new this.postModel(dto);
    return post.save();
  }

  async updatePostById(dto: UpdatePostDto, id: string) {
    const post = await this.postModel.findOne({ id });
    if (!post) throw new NotFoundException();
    post.updatePost(dto);
    post.save();
    return;
  }

  async deletePostById(id: string) {
    const deleteResult = await this.postModel.deleteOne({ id });
    if (!deleteResult.deletedCount) throw new NotFoundException();
    return;
  }
}
