import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class IngestionService {
  constructor(private readonly httpService: HttpService) {}

  //  Trigger Ingestion in Python Backend
  async triggerIngestion() {
    try {
      const response = await firstValueFrom(
        this.httpService.post('http://python-backend/ingest', {})
      );
      return response.data;
    } catch (error) {
      throw new Error(` Failed to trigger ingestion: ${error.message}`);
    }
  }

  //  Check Ingestion Status
  async getIngestionStatus() {
    try {
      const response = await firstValueFrom(
        this.httpService.get('http://python-backend/ingestion/status')
      );
      return response.data;
    } catch (error) {
      throw new Error(` Failed to fetch ingestion status: ${error.message}`);
    }
  }

  //  Manage Ongoing Ingestion (Stop/Restart)
  async manageIngestion(action: 'stop' | 'restart') {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`http://python-backend/ingestion/${action}`, {})
      );
      return response.data;
    } catch (error) {
      throw new Error(` Failed to ${action} ingestion: ${error.message}`);
    }
  }
}
