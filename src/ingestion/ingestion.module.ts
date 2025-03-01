import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { IngestionService } from './ingestion.service';
import { IngestionController } from './ingestion.controller';

@Module({
  imports: [HttpModule],
  providers: [IngestionService],
  controllers: [IngestionController],
})
export class IngestionModule {}
