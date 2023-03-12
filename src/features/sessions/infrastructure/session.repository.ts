import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Session, SessionDocument } from '../domain/entities/session.schema';
import { Model } from 'mongoose';

@Injectable()
export class SessionRepository {
  constructor(
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
  ) {}
  async createNewSession(newSession: Session): Promise<undefined> {
    const session = new this.sessionModel(newSession);
    await session.save();
    return;
  }

  async updateSessionAfterRefreshToken(
    userId: string,
    deviceId: string,
    lastActiveDate: string,
    newLastActiveDate: string,
  ) {
    return this.sessionModel.updateOne(
      {
        userId,
        deviceId,
        lastActiveDate,
      },
      { lastActiveDate: newLastActiveDate },
    );
  }

  deleteSessionByUserIdDeviceIdDate(
    userId: string,
    deviceId: string,
    lastActiveDate: string,
  ) {
    return this.sessionModel.deleteOne({ userId, deviceId, lastActiveDate });
  }

  deleteAllSessionsExcludeCurrent(userId: string, deviceId: string) {
    return this.sessionModel
      .deleteMany({ userId, deviceId: { $ne: deviceId } })
      .exec();
  }

  async deleteSessionByUserIdDeviceId(userId: string, deviceId: string) {
    await this.sessionModel.deleteOne({ userId, deviceId });
    return;
  }
}
