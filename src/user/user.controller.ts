import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import {LoginUserDto, PhoneNumberDto, PhoneVerifyDto, SignupUserDto} from './user.dto';
import { UserGuard } from '../auth/user.guard';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  @ApiBody({ type: SignupUserDto })
  @ApiOperation({
    summary: '일반 유저 가입',
    description: '일반 유저 계정을 생성합니다.',
  })
  signup(@Body() dto: SignupUserDto) {
    return this.userService.createUser(dto);
  }

  @Post('login')
  @ApiBody({ type: LoginUserDto })
  @ApiOperation({
    summary: '일반 유저 로그인',
    description: '엑세스 토큰을 발급합니다.',
  })
  login(@Body() dto: LoginUserDto) {
    return this.userService.getAccessToken(dto);
  }

  @Post('phone-verify')
  @ApiBody({ type: PhoneVerifyDto })
  @ApiOperation({
    summary: '휴대폰 번호 인증',
    description: '인증코드로 휴대폰 번호를 확인합니다.',
  })
  verifyPhoneNumber(@Body() dto: PhoneVerifyDto) {
    return this.userService.verifyPhoneNumber(dto.phone, dto.code);
  }

  @Post('code-resend')
  @ApiBody({ type: PhoneNumberDto })
  @ApiOperation({
    summary: '인증코드 재전송',
    description: '입력한 휴대폰 번호로 인증코드를 다시 보냅니다.',
  })
  verifyCodeResend(@Body() dto: PhoneNumberDto) {
    return this.userService.verifyCodeResend(dto.phone);
  }

  // TODO: 완성되면 지우기
  @UseGuards(UserGuard)
  @ApiBearerAuth()
  @Get('auth-test')
  test() {
    return 'Hello World!';
  }
}
