import { Test, TestingModule } from '@nestjs/testing';
import { ScrapbookService } from './scrapbook.service';

describe('ScrapbookService', () => {
  let service: ScrapbookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScrapbookService],
    }).compile();

    service = module.get<ScrapbookService>(ScrapbookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
