import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from './store.entity';
import { CreateStoreDto } from './store.dto';
import { Owner } from '../../owner/owner.entity';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepo: Repository<Store>,
  ) {}

  createStore(dto: CreateStoreDto, owner: Owner) {
    return this.storeRepo.save({
      name: dto.name.trim(),
      location: dto.location.trim(),
      business_number: dto.business_number.trim(),
      owner_uuid: owner.uuid,
    });
  }

  findByOwner(owner: Owner) {
    return this.storeRepo.find({ owner_uuid: owner.uuid });
  }
}
