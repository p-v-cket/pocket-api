import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { OwnerService } from '../owner/owner.service';
import { Owner } from '../owner/owner.entity';

@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly ownerService: OwnerService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const bearerToken = request.headers.authorization;
    if (bearerToken == null) throw new ForbiddenException();

    const accessToken = bearerToken.substring(7, bearerToken.length);
    const user: Owner = await this.ownerService.verifyToken(accessToken);

    if (user) {
      if (!user.phone_verified)
        throw new ForbiddenException('Please verify your phone number first.');

      if (user.is_blocked)
        throw new ForbiddenException(
          'This account has been suspended for any regulatory violations.',
        );

      request.user = user;
      return true;
    }

    return false;
  }
}
