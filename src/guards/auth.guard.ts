import { AUTH_METADATA_KEY } from 'src/shared/constants';
import { IRequestWithUserCtx } from './../shared/types';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthEndpointDto } from 'src/decorators/auth-endpoint.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext) {
    const authMetadata = this.reflector.get<AuthEndpointDto | undefined>(
      AUTH_METADATA_KEY,
      ctx.getHandler(),
    );
    const authReq = ctx.switchToHttp().getRequest<IRequestWithUserCtx>();

    return (
      !authMetadata ||
      (authReq.user &&
        authMetadata?.namespaces?.includes(authReq.user.namespace)) ||
      (!authReq.user && !!authMetadata.isPublic)
    );
  }
}
