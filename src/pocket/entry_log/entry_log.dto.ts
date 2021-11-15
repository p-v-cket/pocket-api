import { ApiProperty } from '@nestjs/swagger';

export class CreateEntryLogDto {
  @ApiProperty()
  readonly user_uuid: string;
  @ApiProperty()
  readonly store_uuid: string;
}
