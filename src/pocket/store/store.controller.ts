import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { StoreService } from './store.service';
import { CreateStoreDto } from './store.dto';
import { OwnerGuard } from '../../auth/owner.guard';

@ApiTags('Store')
@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post()
  @ApiBody({ type: CreateStoreDto })
  @ApiOperation({
    summary: '[사장님] 가게 정보 등록',
    description: '새로운 가게 정보를 등록합니다.',
  })
  @ApiBearerAuth()
  @UseGuards(OwnerGuard)
  create(@Body() dto: CreateStoreDto, @Req() req) {
    return this.storeService.createStore(dto, req.user);
  }

  @Get('owner')
  @ApiOperation({
    summary: '[사장님] 내 가게 리스트 조회',
    description: '내 가게 리스트를 모두 가져옵니다.',
  })
  @ApiBearerAuth()
  @UseGuards(OwnerGuard)
  findByOwner(@Req() req) {
    return this.storeService.findByOwner(req.user);
  }
}
