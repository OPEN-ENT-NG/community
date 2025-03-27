import { Test, TestingModule } from '@nestjs/testing';
import { ScrapbookController } from './scrapbook.controller';

describe('ScrapbookController', () => {
  let controller: ScrapbookController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScrapbookController],
    }).compile();

    controller = module.get<ScrapbookController>(ScrapbookController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
