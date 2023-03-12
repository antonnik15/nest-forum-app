import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtService {
  constructor(private readonly configService: ConfigService) {}

  private accessTokenSecret =
    this.configService.get<string>('JWT_ACCESS_SECRET');

  private refreshTokenSecret =
    this.configService.get<string>('JWT_REFRESH_SECRET');

  signAccessAndRefreshToken(userId: string, deviceId: string) {
    const accessToken = jwt.sign({ userId, deviceId }, this.accessTokenSecret, {
      expiresIn: '5m',
    });
    const refreshToken = jwt.sign(
      { userId, deviceId },
      this.refreshTokenSecret,
      {
        expiresIn: '10m',
      },
    );

    return { accessToken, refreshToken };
  }

  getIatFromRefreshToken(refreshToken: string) {
    const payload: any = jwt.decode(refreshToken);
    return new Date(payload.iat * 1000).toISOString();
  }

  verifyAccessToken(accessToken: string): any {
    try {
      return jwt.verify(accessToken, this.accessTokenSecret);
    } catch (e) {
      return null;
    }
  }

  verifyRefreshToken(refreshToken: string): any {
    try {
      return jwt.verify(refreshToken, this.refreshTokenSecret);
    } catch (e) {
      return null;
    }
  }
}
