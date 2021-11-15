import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OwnerGuard } from '../../auth/owner.guard';
import { EntryLogService } from './entry_log.service';
import { CreateEntryLogDto } from './entry_log.dto';

@ApiTags('Entry Log')
@Controller('entry_log')
export class EntryLogController {
  constructor(private readonly entryLogService: EntryLogService) {}

  @Post()
  @ApiBody({ type: CreateEntryLogDto })
  @ApiOperation({
    summary: '[사장님] 출입 명부 생성',
    description: '유저 출입 명부를 생성합니다.',
  })
  @ApiBearerAuth()
  @UseGuards(OwnerGuard)
  create(@Body() dto: CreateEntryLogDto) {
    return this.entryLogService.createLog(dto);
  }

  @Get('store/:uuid')
  @ApiOperation({
    summary: '[사장님] 가게 출입 명부 조회',
    description: '가게에 출입한 유저 정보를 모두 가져옵니다.',
  })
  @ApiBearerAuth()
  @UseGuards(OwnerGuard)
  findByOwner(@Param('uuid') storeUuid: string) {
    return this.entryLogService.findUserLogs(storeUuid);
  }
}
