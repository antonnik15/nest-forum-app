import { Injectable } from '@nestjs/common';
import { UsersQueryObj } from '../api/dto/users.query.obj';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../domain/entities/users.schema';
import { Model } from 'mongoose';
import { UserViewModelMapper } from '../../../helpers/user.view.model.mapper';
import { UserViewModel } from '../api/dto/user.view.model';

@Injectable()
export class UserQueryRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private userViewModelMapper: UserViewModelMapper,
  ) {}
  async getAllUsers(queryObj: UsersQueryObj): Promise<UserViewModel[]> {
    const filter = this.createFilterForSearchingUser(queryObj);
    const users = await this.userModel
      .find(filter)
      .sort({ [queryObj.sortBy]: queryObj.sortDirection })
      .skip(queryObj.getCountOfSkipElem)
      .limit(+queryObj.pageSize)
      .select(['-_id', '-__v'])
      .exec();
    return this.userViewModelMapper.createUserArray(users);
  }

  private createFilterForSearchingUser(queryObj: UsersQueryObj) {
    const filter = {};

    if (queryObj.searchEmailTerm) {
      filter['accountData.email'] = {
        $regex: queryObj.searchEmailTerm,
        options: 'i',
      };
      if (queryObj.searchLoginTerm) {
        filter['accountData.login'] = {
          $regex: queryObj.searchLoginTerm,
          options: 'i',
        };
      }
    }

    return filter;
  }
}
