import { ApiProperty } from '@nestjs/swagger';

export class SignupOwnerDto {
  @ApiProperty()
  readonly phone: string;
  @ApiProperty()
  readonly name: string;
  @ApiProperty()
  readonly raw_password: string;
}

export class LoginOwnerDto {
  @ApiProperty()
  readonly phone: string;
  @ApiProperty()
  readonly password: string;
}
