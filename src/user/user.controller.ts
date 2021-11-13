import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { LoginUserDto, SignupUserDto } from './user.dto';
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
  async login(@Body() dto: LoginUserDto) {
    return this.userService.getAccessToken(dto);
  }

  // TODO: 완성되면 지우기
  @UseGuards(UserGuard)
  @ApiBearerAuth()
  @Get('auth-test')
  test() {
    return 'Hello World!';
  }
}
