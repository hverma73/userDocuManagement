import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../authService/admin.guard';
import { DocumentsService } from './document.service';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { title: string },
    @Req() req
  ) {
    const uploadedBy = req.user.id;
    return this.documentsService.createDocument(body.title, file.buffer.toString('utf-8'), uploadedBy);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllDocuments() {
    return this.documentsService.getDocuments();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getDocument(@Param('id') id: number) {
    return this.documentsService.getDocumentById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateDocument(
    @Param('id') id: number,
    @Body() body: { title: string; content: string }
  ) {
    return this.documentsService.updateDocument(id, body.title, body.content);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteDocument(@Param('id') id: number) {
    return this.documentsService.deleteDocument(id);
  }
}
