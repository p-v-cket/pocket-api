import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { LoginUserDto, SignupUserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(dto: SignupUserDto) {
    const check = await this.userRepo.findOne({ phone: dto.phone.trim() });
    if (check)
      throw new BadRequestException('Already registered phone number.');

    const cryptoSalt = this.generateRandomString(64);
    const encryptedPassword = this.encryptPassword(
      dto.raw_password.trim(),
      cryptoSalt,
    );

    const { password, salt_key, temp_code, ...user } = await this.userRepo.save(
      {
        name: dto.name.trim(),
        phone: dto.phone.trim(),
        area: dto.area.trim(),
        password: encryptedPassword,
        salt_key: cryptoSalt,
        temp_code: this.generateRandomString(6),
      },
    );

    return user;
  }

  async getAccessToken(dto: LoginUserDto) {
    const user = await this.userRepo.findOne({ phone: dto.phone.trim() });

    if (
      user &&
      user.password === this.encryptPassword(dto.password.trim(), user.salt_key)
    ) {
      return await this.issueToken(user);
    } else {
      throw new UnauthorizedException(
        'Non-existent phone number or incorrect password.',
      );
    }
  }

  private async issueToken(user: User) {
    const { password, salt_key, temp_code, ...payload } = user;
    return await this.jwtService.signAsync(
      { user: payload, iat: new Date().getTime() },
      {
        issuer: 'pocket-api',
      },
    );
  }

  async verifyToken(token: string) {
    try {
      const res = await this.jwtService.verifyAsync(token);
      // 토큰이 만료 됬을 경우
      if (res.exp < new Date().getTime()) return null;
      return res.user;
    } catch (error) {
      return null;
    }
  }

  private generateRandomString(size = 64) {
    return crypto.randomBytes(size).toString('base64');
  }

  private encryptPassword(password: string, cryptoSalt: string) {
    return crypto
      .pbkdf2Sync(password, cryptoSalt, 10000, 64, 'sha512')
      .toString('base64');
  }
}
