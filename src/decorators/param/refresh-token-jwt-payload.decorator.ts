import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const RefreshTokenJwtPayload = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.refreshTokenJwtPayload;
  },
);
