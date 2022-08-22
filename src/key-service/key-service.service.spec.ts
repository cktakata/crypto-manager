import { Test, TestingModule } from '@nestjs/testing';
import { KeyServiceService } from './key-service.service';

describe('KeyServiceService', () => {
  let service: KeyServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KeyServiceService],
    }).compile();

    service = module.get<KeyServiceService>(KeyServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
