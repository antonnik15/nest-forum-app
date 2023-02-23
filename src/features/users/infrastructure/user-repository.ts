import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../domain/entities/users.schema';
import { Model } from 'mongoose';
import { CreateUserDtoForDb } from '../api/dto/create.user.dto.for.db';
import { RegistrationUserDto } from '../../auth/api/dto/registration.user.dto';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(dtoForDb: CreateUserDtoForDb | RegistrationUserDto) {
    const user = new this.userModel(dtoForDb);
    return await user.save();
  }

  async deleteUserById(id: string) {
    const user = await this.userModel.findOne({ id });
    if (!user) throw new NotFoundException();
    await user.deleteOne();
    return;
  }
}
