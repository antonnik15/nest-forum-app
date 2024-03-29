import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { RegistrationUserDto } from './dto/registration.user.dto';
import { AuthService } from '../application/auth.service';
import { RegistrationConfirmationDto } from '../../users/api/dto/registration-confirmation.dto';
import { RegistrationEmailResendingDto } from '../../users/api/dto/registration-email-resending.dto';
import { LoginDto } from '../../users/api/dto/login.dto';
import { UserAgent } from '../../../decorators/param/user-agent.decorator';
import { RealIp } from 'nestjs-real-ip';
import { RefreshToken } from '../../../decorators/param/refresh-token.decorator';
import { RecoveryPasswordDto } from './dto/recovery-password.dto';
import { NewPasswordDto } from './dto/new-password-dto';
import { BearerAuthGuard } from '../../../guards/bearer-auth.guard';
import { UserInfoDto } from './dto/user-info.dto';
import { UserInfo } from '../../../decorators/param/user-info.decorator';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SkipThrottle(false)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @UserAgent() userAgent: string,
    @RealIp() ip: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.login(
      loginDto,
      userAgent,
      ip,
    );
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
    return { accessToken };
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @RefreshToken() token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!token) throw new UnauthorizedException();

    try {
      const { accessToken, refreshToken } = await this.authService.refreshToken(
        token,
      );
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
      });
      return { accessToken };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @SkipThrottle(false)
  @Post('registration')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registration(@Body() registrationDto: RegistrationUserDto) {
    return this.authService.registration(registrationDto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@RefreshToken() token: string) {
    if (!token) throw new UnauthorizedException();
    const deletionResult = await this.authService.logout(token);
    if (!deletionResult.deletedCount) throw new UnauthorizedException();
    return;
  }

  @SkipThrottle(false)
  @Post('registration-confirmation')
  @HttpCode(HttpStatus.NO_CONTENT)
  confirmRegistration(@Body() confirmationDto: RegistrationConfirmationDto) {
    return this.authService.confirmUserEmail(confirmationDto.code);
  }

  @SkipThrottle(false)
  @Post('registration-email-resending')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationEmailResending(
    @Body() resendingDto: RegistrationEmailResendingDto,
  ) {
    return await this.authService.resendRegistrationEmail(resendingDto.email);
  }

  @SkipThrottle(false)
  @Post('password-recovery')
  @HttpCode(HttpStatus.NO_CONTENT)
  async passwordRecovery(@Body() recoveryPasswordDto: RecoveryPasswordDto) {
    return this.authService.recoveryPassword(recoveryPasswordDto.email);
  }

  @SkipThrottle(false)
  @Post('new-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async newPassword(@Body() newPasswordDto: NewPasswordDto) {
    return this.authService.newPassword(newPasswordDto);
  }

  @UseGuards(BearerAuthGuard)
  @Get('me')
  @HttpCode(HttpStatus.OK)
  getInfoAboutCurrentUser(@UserInfo() userInfo: UserInfoDto) {
    return {
      userId: userInfo.id,
      email: userInfo.email,
      login: userInfo.login,
    };
  }
}
