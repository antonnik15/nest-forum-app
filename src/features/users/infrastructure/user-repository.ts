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

  async updateConfirmationStatus(id: string) {
    return this.userModel.updateOne({ id }, { 'emailInfo.isConfirmed': true });
  }

  async updateConfirmationCode(id: string, newUUID: string) {
    return this.userModel.updateOne(
      { id },
      { 'emailInfo.confirmationCode': newUUID },
    );
  }

  updatePasswordRecoveryCode(id: string, newRecoveryCode: string) {
    return this.userModel.updateOne(
      { id },
      {
        'passwordRecoveryInfo.recoveryCode': newRecoveryCode,
        'passwordRecoveryInfo.recoveryStatus': false,
      },
    );
  }

  changePassword(id: string, passwordHash: string) {
    return this.userModel.updateOne(
      { id },
      {
        'accountData.passwordHash': passwordHash,
        'passwordRecoveryInfo.recoveryCode': null,
        'passwordRecoveryInfo.recoveryStatus': true,
      },
    );
  }
}
