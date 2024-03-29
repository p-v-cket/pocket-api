import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OwnerModule } from './owner/owner.module';
import { StoreModule } from './pocket/store/store.module';
import { EntryLogModule } from './pocket/entry_log/entry_log.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    UserModule,
    OwnerModule,
    StoreModule,
    EntryLogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
