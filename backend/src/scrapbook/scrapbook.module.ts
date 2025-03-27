import { Module } from '@nestjs/common';
import { ScrapbookService } from './scrapbook.service';
import { ScrapbookController } from './scrapbook.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Page,
  PageSchema,
  Scrapbook,
  ScrapbookSchema,
} from './scrapbook.schema';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Scrapbook.name, schema: ScrapbookSchema },
      { name: Page.name, schema: PageSchema },
    ]),
    LoggerModule,
  ],
  providers: [ScrapbookService],
  controllers: [ScrapbookController],
})
export class ScrapbookModule {}
