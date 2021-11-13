import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { User } from './user.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '3000h' }, // 단위 문제가 있음... 1000 곱해야 3시간임
      // TODO: 토큰 만료시간 나중에 1시간으로 바꾸기
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
