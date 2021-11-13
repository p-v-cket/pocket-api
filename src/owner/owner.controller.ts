import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OwnerService } from './owner.service';
import { LoginOwnerDto, SignupOwnerDto } from './owner.dto';
import { OwnerGuard } from '../auth/owner.guard';

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

  // TODO: 완성되면 지우기
  @UseGuards(OwnerGuard)
  @ApiBearerAuth()
  @Get('auth-test')
  test() {
    return 'Hello World!';
  }
}
