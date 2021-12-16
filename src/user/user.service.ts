import {
  BadRequestException,
  HttpService,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { LoginUserDto, ResetPasswordDto, SignupUserDto } from './user.dto';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private httpService: HttpService,
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
        temp_code: this.generateRandomCode(6),
      },
    );

    await this.sendMessage(
      `[POCKET] 인증코드는 ${temp_code} 입니다.`,
      user.phone,
    );

    return user;
  }

  async verifyPhoneNumber(phoneNumber: string, code: string) {
    const user = await this.userRepo.findOne({
      phone: phoneNumber,
      temp_code: code,
    });
    if (user) {
      // 인증코드가 일치할 경우 -> 번호 인증 여부 True + 기존 인증코드 변경
      await this.userRepo.update(
        { uuid: user.uuid },
        { temp_code: this.generateRandomCode(6), phone_verified: true },
      );
      return '인증 성공!';
    }
    throw new UnauthorizedException('인증코드가 올바르지 않습니다.');
  }

  async verifyCodeResend(phoneNumber: string) {
    const user = await this.userRepo.findOne({
      phone: phoneNumber,
    });

    if (user) {
      const code = this.generateRandomCode(6);
      await this.userRepo.update(
        { phone: phoneNumber },
        { temp_code: code, phone_verified: true },
      );

      await this.sendMessage(`[POCKET] 인증코드는 ${code} 입니다.`, user.phone);
      return '인증코드 전송됨';
    }
    throw new UnauthorizedException('등록되지 않은 사용자입니다.');
  }

  async sendMessage(content: string, phoneNumber: string) {
    // Signature 생성하기
    const date = Date.now().toString();
    const serviceId = process.env.SMS_API_SERVICE_ID;
    const secretKey = process.env.SMS_API_SECRET_KEY;
    const accessKey = process.env.SMS_API_ACCESS_KEY;
    const method = 'POST';
    const space = ' ';
    const newLine = '\n';
    const url = `/sms/v2/services/${serviceId}/messages`;
    const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
    hmac.update(method);
    hmac.update(space);
    hmac.update(url);
    hmac.update(newLine);
    hmac.update(date);
    hmac.update(newLine);
    hmac.update(accessKey);
    const hash = hmac.finalize();
    const signature = hash.toString(CryptoJS.enc.Base64);

    // SMS 요청하기
    return this.httpService
      .post(
        `https://sens.apigw.ntruss.com${url}`,
        {
          type: 'SMS',
          from: `${process.env.SMS_API_PHONE_NUMBER}`,
          contentType: 'COMM',
          content: content,
          messages: [{ to: phoneNumber }],
          files: [],
        },
        {
          headers: {
            'x-ncp-apigw-timestamp': date,
            'x-ncp-iam-access-key': accessKey,
            'x-ncp-apigw-signature-v2': signature,
          },
        },
      )
      .toPromise();
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

  generateRandomCode(n: number) {
    let str = '';
    for (let i = 0; i < n; i++) {
      str += Math.floor(Math.random() * 10);
    }
    return str;
  }

  async resetPassword(dto: ResetPasswordDto) {
    // 번호랑 인증코드 확인 후
    const user = await this.userRepo.findOne({
      phone: dto.phone,
      temp_code: dto.code,
    });
    if (user) {
      const cryptoSalt = this.generateRandomString(64);
      const encryptedPassword = this.encryptPassword(
        dto.new_password.trim(),
        cryptoSalt,
      );

      // 비밀번호 변경
      await this.userRepo.update(
        { uuid: user.uuid },
        {
          temp_code: this.generateRandomCode(6),
          password: encryptedPassword,
          salt_key: cryptoSalt,
        },
      );
      return '비밀번호 변경됨';
    }
    throw new UnauthorizedException(
      '잘못된 인증번호 또는 등록되지 않은 사용자입니다.',
    );
  }
}
