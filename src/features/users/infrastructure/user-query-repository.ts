import { Injectable } from '@nestjs/common';
import { UserPaginationDto } from '../api/dto/user.pagination.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../domain/entities/users.schema';
import { Model } from 'mongoose';
import { UserViewModelMapper } from '../../../helpers/user.view.model.mapper';
import { UserOutputObject } from '../api/dto/user.output.object';

@Injectable()
export class UserQueryRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private userViewModelMapper: UserViewModelMapper,
  ) {}
  async getAllUsers(
    paginationDto: UserPaginationDto,
  ): Promise<UserOutputObject> {
    const filter = this.createFilterForSearchingUser(paginationDto);
    const countDocuments = await this.userModel.countDocuments(filter);
    const sortBy = 'accountData.' + paginationDto.sortBy;
    const users = await this.userModel
      .find(filter)
      .sort({ [sortBy]: paginationDto.sortDirection })
      .skip(paginationDto.getCountOfSkipElem)
      .limit(paginationDto.pageSize)
      .select(['-_id', '-__v']);
    const usersArray = this.userViewModelMapper.createUserArray(users);
    return new UserOutputObject(paginationDto, usersArray, countDocuments);
  }

  private createFilterForSearchingUser(queryObj: UserPaginationDto) {
    const filter = { $or: [] };

    if (queryObj.searchEmailTerm) {
      filter.$or.push({
        'accountData.email': {
          $regex: queryObj.searchEmailTerm,
          $options: 'i',
        },
      });
      if (queryObj.searchLoginTerm) {
        filter.$or.push({
          'accountData.login': {
            $regex: queryObj.searchLoginTerm,
            $options: 'i',
          },
        });
      }
    }

    return filter;
  }

  findUserByLogin(login: string) {
    return this.userModel
      .findOne({ 'accountData.login': login })
      .select(['-_id', '-__v']);
  }

  findUserByEmail(email: string) {
    return this.userModel
      .findOne({ 'accountData.email': email })
      .select(['-_id', '-__v']);
  }
}
