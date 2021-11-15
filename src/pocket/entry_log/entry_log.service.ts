import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntryLog } from './entry_log.entity';
import { CreateEntryLogDto } from './entry_log.dto';

@Injectable()
export class EntryLogService {
  constructor(
    @InjectRepository(EntryLog)
    private readonly entryLogRepo: Repository<EntryLog>,
  ) {}

  createLog(dto: CreateEntryLogDto) {
    return this.entryLogRepo.save({
      user_uuid: dto.user_uuid,
      store_uuid: dto.store_uuid,
    });
  }

  findUserLogs(storeUuid: string) {
    return this.entryLogRepo
      .createQueryBuilder('entry_log')
      .leftJoinAndSelect('entry_log.user', 'user')
      .where('entry_log.store_uuid = :uuid', { uuid: storeUuid })
      .select([
        'entry_log.created_at',
        'user.uuid',
        'user.name',
        'user.phone',
        'user.area',
      ])
      .getMany();
  }
}
