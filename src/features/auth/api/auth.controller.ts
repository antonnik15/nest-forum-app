import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { RegistrationUserDto } from './dto/registration.user.dto';
import { AuthService } from '../application/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('registration')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registration(@Body() registrationDto: RegistrationUserDto) {
    return this.authService.registration(registrationDto);
  }
}
