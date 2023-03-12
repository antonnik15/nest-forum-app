import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogsController } from './features/blogs/api/blogs.controller';
import { CommentController } from './features/comments/api/commentController';
import { PostController } from './features/posts/api/postController';
import { TestingController } from './features/testing/api/testing.controller';
import { UserController } from './features/users/api/user.controller';
import { BlogsService } from './features/blogs/application/blogs.service';
import { CommentService } from './features/comments/application/comments.service';
import { PostService } from './features/posts/application/post.service';
import { TestingService } from './features/testing/application/testing.service';
import { UserService } from './features/users/application/user.service';
import { BlogQueryRepository } from './features/blogs/infrastructure/blog-query-repository';
import { CommentQueryRepository } from './features/comments/infrastructure/comment-query-repository';
import { PostQueryRepository } from './features/posts/infrastructure/post.query.repository';
import { UserQueryRepository } from './features/users/infrastructure/user-query-repository';
import { BlogRepository } from './features/blogs/infrastructure/blog-repository';
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
import { UserLoginExistValidator } from './validators/user-login.exist.validator';
import { AuthController } from './features/auth/api/auth.controller';
import { AuthService } from './features/auth/application/auth.service';
import { UserEmailExistValidator } from './validators/user-email-exist.validator';
import { EmailModule } from './features/email/email.module';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from './features/auth/application/jwt.service';
import {
  Session,
  SessionSchema,
} from './features/sessions/domain/entities/session.schema';
import { CommentRepository } from './features/comments/infrastructure/comment-repository';
import { ReactionRepository } from './features/reaction/infrastructure/reaction-repository';
import { ReactionService } from './features/reaction/application/reaction.service';
import {
  Reaction,
  ReactionSchema,
} from './features/reaction/domain/entities/reaction.schema';
import { SessionController } from './features/sessions/api/session.controller';
import { SessionService } from './features/sessions/application/session.service';
import { SessionQueryRepository } from './features/sessions/infrastructure/session.query.repository';
import { SessionRepository } from './features/sessions/infrastructure/session.repository';
import { BasicAuthGuard } from './guards/basic-auth.guard';
import { BearerAuthGuard } from './guards/bearer-auth.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';

const controllers = [
  BlogsController,
  CommentController,
  PostController,
  TestingController,
  UserController,
  AuthController,
  SessionController,
];

const guards = [BasicAuthGuard, BearerAuthGuard, RefreshTokenGuard];

const services = [
  BlogsService,
  CommentService,
  PostService,
  TestingService,
  UserService,
  AuthService,
  JwtService,
  ReactionService,
  SessionService,
];

const queryRepositories = [
  BlogQueryRepository,
  CommentQueryRepository,
  PostQueryRepository,
  UserQueryRepository,
  SessionQueryRepository,
];

const repositories = [
  BlogRepository,
  PostRepository,
  UserRepository,
  TestingRepository,
  CommentRepository,
  ReactionRepository,
  SessionRepository,
  ...queryRepositories,
];

const mongooseModels = [
  { name: Blog.name, schema: BlogSchema },
  { name: Comment.name, schema: CommentSchema },
  { name: Like.name, schema: LikeSchema },
  { name: Post.name, schema: PostSchema },
  { name: User.name, schema: UserSchema },
  { name: Session.name, schema: SessionSchema },
  { name: Reaction.name, schema: ReactionSchema },
];

const mappers = [
  UserViewModelMapper,
  CommentViewModelMapper,
  PostViewModelMapper,
  CommentViewModelMapper,
];

const validators = [UserLoginExistValidator, UserEmailExistValidator];

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI, { dbName: 'nest' }),
    MongooseModule.forFeature(mongooseModels),
    ConfigModule.forRoot({ isGlobal: true }),
    EmailModule,
  ],
  controllers: [...controllers],
  providers: [
    ...guards,
    ...repositories,
    ...services,
    ...mappers,
    ...validators,
  ],
})
export class AppModule {}
