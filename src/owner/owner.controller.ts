import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OwnerService } from './owner.service';
import { LoginOwnerDto, SignupOwnerDto } from './owner.dto';
import { OwnerGuard } from '../auth/owner.guard';
import {
  PhoneNumberDto,
  PhoneVerifyDto,
  ResetPasswordDto,
} from '../user/user.dto';

@ApiTags('Owner')
@Controller('owner')
export class OwnerController {
  constructor(private readonly ownerService: OwnerService) {}

  @Post('signup')
  @ApiBody({ type: SignupOwnerDto })
  @ApiOperation({
    summary: '사장님 가입',
    description: '사장님 계정을 생성합니다.',
  })
  signup(@Body() dto: SignupOwnerDto) {
    return this.ownerService.createOwner(dto);
  }

  @Post('login')
  @ApiBody({ type: LoginOwnerDto })
  @ApiOperation({
    summary: '사장님 로그인',
    description: '엑세스 토큰을 발급합니다.',
  })
  async login(@Body() dto: LoginOwnerDto) {
    return this.ownerService.getAccessToken(dto);
  }

  @Post('phone-verify')
  @ApiBody({ type: PhoneVerifyDto })
  @ApiOperation({
    summary: '휴대폰 번호 인증',
    description: '인증코드로 휴대폰 번호를 확인합니다.',
  })
  verifyPhoneNumber(@Body() dto: PhoneVerifyDto) {
    return this.ownerService.verifyPhoneNumber(dto.phone, dto.code);
  }

  @Post('code-resend')
  @ApiBody({ type: PhoneNumberDto })
  @ApiOperation({
    summary: '인증코드 재전송',
    description: '입력한 휴대폰 번호로 인증코드를 다시 보냅니다.',
  })
  verifyCodeResend(@Body() dto: PhoneNumberDto) {
    return this.ownerService.verifyCodeResend(dto.phone);
  }

  @Post('change-password')
  @ApiBody({ type: ResetPasswordDto })
  @ApiOperation({
    summary: '암호 변경',
    description: '사장님 암호를 변경합니다.',
  })
  changePassword(@Body() dto: ResetPasswordDto) {
    return this.ownerService.resetPassword(dto);
  }

  // TODO: 완성되면 지우기
  @UseGuards(OwnerGuard)
  @ApiBearerAuth()
  @Get('auth-test')
  test() {
    return 'Hello World!';
  }
}
