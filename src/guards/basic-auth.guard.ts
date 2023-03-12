import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class BasicAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const auth = request.headers.authorization;
    if (!auth) throw new UnauthorizedException();
    const [authType, authPayload] = auth.split(' ');
    if (authType !== 'Basic') throw new UnauthorizedException();
    const decodedPayload = Buffer.from(authPayload, 'base64').toString();
    if (decodedPayload !== 'admin:qwerty') throw new UnauthorizedException();
    return true;
  }
}
