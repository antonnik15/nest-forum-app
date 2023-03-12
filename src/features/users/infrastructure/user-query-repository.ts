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
    private readonly userViewModelMapper: UserViewModelMapper,
  ) {}
  getUser() {
    return this.userModel.find();
  }
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
    let filter;
    if (queryObj.searchEmailTerm) {
      filter = { $or: [] };
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

  findUserByConfirmationCode(code: string) {
    return this.userModel.findOne({ 'emailInfo.confirmationCode': code });
  }

  async findUserByLoginOrEmail(loginOrEmail: string) {
    return this.userModel.findOne({
      $or: [
        { 'accountData.login': loginOrEmail },
        { 'accountData.login': loginOrEmail },
      ],
    });
  }

  findUserById(userId: string) {
    return this.userModel.findOne({ id: userId });
  }

  findUserByPasswordRecoveryCode(recoveryCode: string) {
    return this.userModel.findOne({
      'passwordRecoveryInfo.recoveryCode': recoveryCode,
    });
  }
}
