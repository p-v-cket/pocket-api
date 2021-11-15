import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { Store } from './store.entity';
import { OwnerModule } from '../../owner/owner.module';

@Module({
  imports: [TypeOrmModule.forFeature([Store]), OwnerModule],
  controllers: [StoreController],
  providers: [StoreService],
})
export class StoreModule {}
