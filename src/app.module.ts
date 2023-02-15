import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogsController } from './features/blogs/api/blogs.controller';
import { CommentController } from './features/comments/api/commentController';
import { PostController } from './features/posts/api/postController';
import { TestingController } from './features/testing/api/testing.controller';
import { UserController } from './features/users/api/userController';
import { BlogsService } from './features/blogs/application/blogs.service';
import { CommentService } from './features/comments/application/comments.service';
import { PostService } from './features/posts/application/post.service';
import { TestingService } from './features/testing/application/testing.service';
import { UserService } from './features/users/application/user.service';
import { BlogQueryRepository } from './features/blogs/infrastructure/blog-query-repository.service';
import { CommentQueryRepository } from './features/comments/infrastructure/comment-query-repository.service';
import { PostQueryRepository } from './features/posts/infrastructure/post.query.repository';
import { UserQueryRepository } from './features/users/infrastructure/user-query-repository';
import { BlogRepository } from './features/blogs/infrastructure/blog-repository.service';
import { PostRepository } from './features/posts/infrastructure/post.repository';
import { UserRepository } from './features/users/infrastructure/user-repository';
import { Blog, BlogSchema } from './features/blogs/domain/entities/blog.shema';
import {
  Comment,
  CommentSchema,
} from './features/comments/domain/comment.schema';
import { Like, LikeSchema } from './features/likes/like.schema';
import { Post, PostSchema } from './features/posts/domain/entities/post.schema';
import {
  User,
  UserSchema,
} from './features/users/domain/entities/users.schema';
import { UserViewModelMapper } from './helpers/user.view.model.mapper';
import { CommentViewModelMapper } from './helpers/comment.view.model.mapper';
import { PostViewModelMapper } from './helpers/post.view.model.mapper';
import { TestingRepository } from './features/testing/infrastructure/testing.repository.mongodb';

const controllers = [
  BlogsController,
  CommentController,
  PostController,
  TestingController,
  UserController,
];

const services = [
  BlogsService,
  CommentService,
  PostService,
  TestingService,
  UserService,
];

const queryRepositories = [
  BlogQueryRepository,
  CommentQueryRepository,
  PostQueryRepository,
  UserQueryRepository,
];

const repositories = [
  BlogRepository,
  PostRepository,
  UserRepository,
  TestingRepository,
  ...queryRepositories,
];

const mongooseModels = [
  { name: Blog.name, schema: BlogSchema },
  { name: Comment.name, schema: CommentSchema },
  { name: Like.name, schema: LikeSchema },
  { name: Post.name, schema: PostSchema },
  { name: User.name, schema: UserSchema },
];

const mappers = [
  UserViewModelMapper,
  CommentViewModelMapper,
  PostViewModelMapper,
];

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI, { dbName: 'nest' }),
    MongooseModule.forFeature(mongooseModels),
  ],
  controllers: controllers,
  providers: [...services, ...repositories, ...mappers],
})
export class AppModule {}
