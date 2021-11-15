import { ApiProperty } from '@nestjs/swagger';

export class CreateStoreDto {
  @ApiProperty()
  readonly name: string;
  @ApiProperty()
  readonly location: string;
  @ApiProperty()
  readonly business_number: string;
}
