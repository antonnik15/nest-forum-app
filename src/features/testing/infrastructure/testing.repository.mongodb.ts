import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../../users/domain/entities/users.schema';
import { Model } from 'mongoose';
import { Blog, BlogDocument } from '../../blogs/domain/entities/blog.shema';
import { Comment, CommentDocument } from '../../comments/domain/comment.schema';
import { Post, PostDocument } from '../../posts/domain/entities/post.schema';
import {
  Session,
  SessionDocument,
} from '../../sessions/domain/entities/session.schema';
import {
  Reaction,
  ReactionDocument,
} from '../../reaction/domain/entities/reaction.schema';

@Injectable()
export class TestingRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Blog.name) private readonly blogModel: Model<BlogDocument>,
    @InjectModel(Comment.name)
    private readonly commentModel: Model<CommentDocument>,
    @InjectModel(Reaction.name)
    private readonly reactionModel: Model<ReactionDocument>,
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
    @InjectModel(Session.name)
    private readonly sessionModel: Model<SessionDocument>,
  ) {}
  async wipeAllData() {
    try {
      await this.userModel.deleteMany({});
      await this.blogModel.deleteMany({});
      await this.reactionModel.deleteMany({});
      await this.postModel.deleteMany({});
      await this.commentModel.deleteMany({});
      await this.sessionModel.deleteMany({});
    } catch (e) {
      return false;
    }
  }
}
