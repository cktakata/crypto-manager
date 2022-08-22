import { Test, TestingModule } from '@nestjs/testing';
import { KeyController } from './key-controller.controller';

describe('KeyControllerController', () => {
  let controller: KeyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KeyController],
    }).compile();

    controller = module.get<KeyController>(KeyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
