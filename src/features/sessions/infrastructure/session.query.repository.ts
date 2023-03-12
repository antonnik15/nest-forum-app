import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Session, SessionDocument } from '../domain/entities/session.schema';
import { Model } from 'mongoose';

@Injectable()
export class SessionQueryRepository {
  constructor(
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
  ) {}

  getSessions(userId: string) {
    return this.sessionModel
      .find({ userId })
      .select(['-_id', '-__v', '-userId']);
  }

  findSessionByUserIdDeviceIdDate(
    userId: string,
    deviceId: string,
    lastActiveDate: string,
  ) {
    return this.sessionModel.findOne({ userId, deviceId, lastActiveDate });
  }

  findSessionByDeviceId(deviceId: string) {
    return this.sessionModel.findOne({ deviceId });
  }
}
