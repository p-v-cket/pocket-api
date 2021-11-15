import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OwnerModule } from '../../owner/owner.module';
import { UserModule } from '../../user/user.module';
import { EntryLogController } from './entry_log.controller';
import { EntryLogService } from './entry_log.service';
import { EntryLog } from './entry_log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EntryLog]), OwnerModule, UserModule],
  controllers: [EntryLogController],
  providers: [EntryLogService],
  exports: [EntryLogService],
})
export class EntryLogModule {}
