import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Session } from '../domain/entities/session.schema';
import { SessionRepository } from '../infrastructure/session.repository';
import { RefreshTokenJwtPayloadDto } from '../../auth/api/dto/refresh-token-jwt-payload.dto';
import { SessionQueryRepository } from '../infrastructure/session.query.repository';

@Injectable()
export class SessionService {
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly sessionQueryRepository: SessionQueryRepository,
  ) {}
  createNewSession(newSession: Session): Promise<undefined> {
    return this.sessionRepository.createNewSession(newSession);
  }

  updateSessionAfterRefreshToken(
    userId: string,
    deviceId: string,
    lastActiveDate: string,
    newLastActiveDate: string,
  ) {
    return this.sessionRepository.updateSessionAfterRefreshToken(
      userId,
      deviceId,
      lastActiveDate,
      newLastActiveDate,
    );
  }

  deleteSessionByUserIdDeviceIdDate(
    userId: string,
    deviceId: string,
    lastActiveDate: string,
  ) {
    return this.sessionRepository.deleteSessionByUserIdDeviceIdDate(
      userId,
      deviceId,
      lastActiveDate,
    );
  }

  deleteAllSessionsExcludeCurrent(
    refreshTokenJwtPayloadDto: RefreshTokenJwtPayloadDto,
  ) {
    return this.sessionRepository.deleteAllSessionsExcludeCurrent(
      refreshTokenJwtPayloadDto.userId,
      refreshTokenJwtPayloadDto.deviceId,
    );
  }

  async deleteSessionByUserIdAndDeviceId(deviceId: string, userId: string) {
    const session = await this.sessionQueryRepository.findSessionByDeviceId(
      deviceId,
    );
    if (!session) throw new NotFoundException();
    if (session.userId !== userId) throw new ForbiddenException();
    return this.sessionRepository.deleteSessionByUserIdDeviceId(
      userId,
      deviceId,
    );
  }
}
