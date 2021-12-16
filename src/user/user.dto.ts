import { ApiProperty } from '@nestjs/swagger';

export class SignupUserDto {
  @ApiProperty()
  readonly phone: string;
  @ApiProperty()
  readonly name: string;
  @ApiProperty()
  readonly area: string;
  @ApiProperty()
  readonly raw_password: string;
}

export class LoginUserDto {
  @ApiProperty()
  readonly phone: string;
  @ApiProperty()
  readonly password: string;
}

export class PhoneVerifyDto {
  @ApiProperty()
  readonly phone: string;
  @ApiProperty()
  readonly code: string;
}

export class PhoneNumberDto {
  @ApiProperty()
  readonly phone: string;
}
