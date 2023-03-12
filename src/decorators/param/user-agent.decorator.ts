import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as useragent from 'useragent';

export const UserAgent = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    const userAgent = request.get('User-Agent');
    return useragent.parse(userAgent).family;
  },
);
