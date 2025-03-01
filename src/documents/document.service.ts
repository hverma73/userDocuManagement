import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './document.entity';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
  ) {}

  async createDocument(title: string, content: string, uploadedBy: number) {
    const document = this.documentRepository.create({ title, content, uploadedBy });
    return this.documentRepository.save(document);
  }

  async getDocuments() {
    return this.documentRepository.find();
  }

  async getDocumentById(id: number) {
    return this.documentRepository.findOne({ where: { id } });
  }

  async updateDocument(id: number, title: string, content: string) {
    await this.documentRepository.update(id, { title, content });
    return this.getDocumentById(id);
  }

  async deleteDocument(id: number) {
    return this.documentRepository.delete(id);
  }
}
