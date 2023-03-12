import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { SessionQueryRepository } from '../infrastructure/session.query.repository';
import { UserInfo } from '../../../decorators/param/user-info.decorator';
import { UserInfoDto } from '../../auth/api/dto/user-info.dto';
import { SessionService } from '../application/session.service';
import { RefreshTokenGuard } from '../../../guards/refresh-token.guard';
import { RefreshTokenJwtPayload } from '../../../decorators/param/refresh-token-jwt-payload.decorator';
import { RefreshTokenJwtPayloadDto } from '../../auth/api/dto/refresh-token-jwt-payload.dto';

@Controller('security/devices')
export class SessionController {
  constructor(
    private readonly sessionQueryRepository: SessionQueryRepository,
    private readonly sessionService: SessionService,
  ) {}

  @UseGuards(RefreshTokenGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllSessionsForCurrentUser(@UserInfo() userInfo: UserInfoDto) {
    return this.sessionQueryRepository.getSessions(userInfo.id);
  }

  @UseGuards(RefreshTokenGuard)
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteAllSessionsExcludeCurrent(
    @RefreshTokenJwtPayload()
    refreshTokenJwtPayloadDto: RefreshTokenJwtPayloadDto,
  ) {
    return this.sessionService.deleteAllSessionsExcludeCurrent(
      refreshTokenJwtPayloadDto,
    );
  }

  @UseGuards(RefreshTokenGuard)
  @Delete(':deviceId')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteSessionByUserIdAndDeviceId(
    @Param('deviceId') deviceId: string,
    @UserInfo() user: UserInfoDto,
  ) {
    return this.sessionService.deleteSessionByUserIdAndDeviceId(
      deviceId,
      user.id,
    );
  }
}
