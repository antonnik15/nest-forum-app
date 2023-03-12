import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegistrationUserDto } from '../api/dto/registration.user.dto';
import { UserService } from '../../users/application/user.service';
import { EmailService } from '../../email/email.service';
import { UserQueryRepository } from '../../users/infrastructure/user-query-repository';
import { randomUUID } from 'crypto';
import { UserRepository } from '../../users/infrastructure/user-repository';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../../users/api/dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from './jwt.service';
import { Session } from '../../sessions/domain/entities/session.schema';
import { SessionService } from '../../sessions/application/session.service';
import { SessionQueryRepository } from '../../sessions/infrastructure/session.query.repository';
import { NewPasswordDto } from '../api/dto/new-password-dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly emailService: EmailService,
    private readonly userQueryRepository: UserQueryRepository,
    private readonly userRepository: UserRepository,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly sessionService: SessionService,
    private readonly sessionQueryRepository: SessionQueryRepository,
  ) {}

  async login(loginDto: LoginDto, userAgent: string, ip: string) {
    const user = await this.userQueryRepository.findUserByLoginOrEmail(
      loginDto.loginOrEmail,
    );
    if (!user) throw new UnauthorizedException('notUser');
    const passwordMatches = await bcrypt.compare(
      loginDto.password,
      user.accountData.passwordHash,
    );
    if (!passwordMatches) throw new UnauthorizedException('wrongPassword');
    const deviceId = randomUUID();
    const tokens = this.jwtService.signAccessAndRefreshToken(user.id, deviceId);
    const lastActiveDate = this.jwtService.getIatFromRefreshToken(
      tokens.refreshToken,
    );

    const newSession: Session = {
      userId: user.id,
      deviceId,
      ip,
      title: userAgent,
      lastActiveDate,
    };
    await this.sessionService.createNewSession(newSession);
    return tokens;
  }

  async refreshToken(token: string) {
    const jwtPayload = this.jwtService.verifyRefreshToken(token);
    if (!jwtPayload) throw new UnauthorizedException();
    const { userId, deviceId } = jwtPayload;
    const lastActiveDate = new Date(jwtPayload.iat * 1000).toISOString();
    const user = this.userQueryRepository.findUserById(userId);
    if (!user) throw new UnauthorizedException();
    const session =
      await this.sessionQueryRepository.findSessionByUserIdDeviceIdDate(
        userId,
        deviceId,
        lastActiveDate,
      );
    if (!session) throw new UnauthorizedException();
    const { accessToken, refreshToken } =
      this.jwtService.signAccessAndRefreshToken(userId, deviceId);
    const newLastActiveDate =
      this.jwtService.getIatFromRefreshToken(refreshToken);
    await this.sessionService.updateSessionAfterRefreshToken(
      userId,
      deviceId,
      lastActiveDate,
      newLastActiveDate,
    );
    return { accessToken, refreshToken };
  }

  async registration(dto: RegistrationUserDto) {
    const user = await this.userService.registerUser(dto);
    await this.emailService.sendEmailConfirmationMessage(
      user.accountData.login,
      user.accountData.email,
      user.emailInfo.confirmationCode,
    );
    return;
  }

  logout(token: string) {
    const { userId, deviceId, lastActiveDate } =
      this.getPayloadObjectFromRefreshToken(token);
    return this.sessionService.deleteSessionByUserIdDeviceIdDate(
      userId,
      deviceId,
      lastActiveDate,
    );
  }

  confirmUserEmail(code: string) {
    return this.userService.confirmUserEmail(code);
  }

  async resendRegistrationEmail(email: string) {
    const user = await this.userQueryRepository.findUserByEmail(email);
    if (!user) throw new BadRequestException('email');
    if (user.emailInfo.isConfirmed) throw new BadRequestException('email');
    const newUUID = randomUUID();
    await this.userRepository.updateConfirmationCode(user.id, newUUID);
    await this.emailService.sendEmailConfirmationMessage(
      user.accountData.login,
      user.accountData.email,
      newUUID,
    );
    return;
  }

  getPayloadObjectFromRefreshToken(token: string) {
    const jwtPayload = this.jwtService.verifyRefreshToken(token);
    if (!jwtPayload) throw new UnauthorizedException();
    const { userId, deviceId } = jwtPayload;
    const lastActiveDate = new Date(jwtPayload.iat * 1000).toISOString();
    return { userId, deviceId, lastActiveDate };
  }

  async recoveryPassword(email: string) {
    const user = await this.userQueryRepository.findUserByEmail(email);
    if (!user) return null;
    const recoveryCode = await this.userService.updateRecoveryCode(user.id);
    return this.emailService.sendPasswordRecoveryCode(
      user.accountData.email,
      user.accountData.login,
      recoveryCode,
    );
  }

  async newPassword(newPasswordDto: NewPasswordDto) {
    const user = await this.userQueryRepository.findUserByPasswordRecoveryCode(
      newPasswordDto.recoveryCode,
    );
    if (!user) throw new BadRequestException();
    return await this.userService.updatePassword(
      user.id,
      newPasswordDto.newPassword,
    );
  }
}
