import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '../features/auth/application/jwt.service';
import { UserQueryRepository } from '../features/users/infrastructure/user-query-repository';

@Injectable()
export class BearerAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userQueryRepository: UserQueryRepository,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const auth = request.headers.authorization;
    if (!auth) throw new UnauthorizedException();
    const [authType, accessToken] = auth.split(' ');
    if (authType !== 'Bearer' || !accessToken)
      throw new UnauthorizedException();
    const jwtPayload = this.jwtService.verifyAccessToken(accessToken);
    if (!jwtPayload) throw new UnauthorizedException();
    const user = await this.userQueryRepository.findUserById(jwtPayload.userId);
    if (!user) throw new UnauthorizedException();
    request.user = {
      id: user.id,
      login: user.accountData.login,
      email: user.accountData.email,
    };
    return true;
  }
}
