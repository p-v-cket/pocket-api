import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const bearerToken = request.headers.authorization;
    if (bearerToken == null) throw new ForbiddenException();

    const accessToken = bearerToken.substring(7, bearerToken.length);
    const user: User = await this.userService.verifyToken(accessToken);

    if (user) {
      if (!user.phone_verified)
        throw new ForbiddenException('Please verify your phone number first.');

      request.user = user;
      return true;
    }

    return false;
  }
}
