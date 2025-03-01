import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { IngestionService } from './ingestion.service';

@Controller('ingestion')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  // ✅ Trigger Ingestion
  @Post('start')
  async startIngestion() {
    return this.ingestionService.triggerIngestion();
  }

  // ✅ Get Ingestion Status
  @Get('status')
  async getStatus() {
    return this.ingestionService.getIngestionStatus();
  }

  // ✅ Manage Ongoing Ingestion (Stop/Restart)
  @Post(':action')
  async manageIngestion(@Param('action') action: 'stop' | 'restart') {
    return this.ingestionService.manageIngestion(action);
  }
}
