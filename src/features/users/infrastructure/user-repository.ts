import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../domain/entities/users.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(dto: User) {
    const user = new this.userModel(dto);
    return await user.save();
  }

  deletePostById(id: string) {
    const user = this.userModel.findOne({ id });
    if (!user) throw new NotFoundException();
    user.remove();
    return;
  }
}
