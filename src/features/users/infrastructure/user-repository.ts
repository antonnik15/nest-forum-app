import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../domain/entities/users.schema';
import { Model } from 'mongoose';
import { CreateUserDtoForDb } from '../api/dto/create.user.dto.for.db';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(dtoForDb: CreateUserDtoForDb) {
    const user = new this.userModel(dtoForDb);
    return await user.save();
  }

  deletePostById(id: string) {
    const user = this.userModel.findOne({ id });
    if (!user) throw new NotFoundException();
    user.remove();
    return;
  }
}
