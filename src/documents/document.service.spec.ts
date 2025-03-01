import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsService } from './document.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Document } from './document.entity';
import { Repository } from 'typeorm';

describe('DocumentsService', () => {
  let service: DocumentsService;
  let repo: Repository<Document>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentsService,
        {
          provide: getRepositoryToken(Document),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<DocumentsService>(DocumentsService);
    repo = module.get<Repository<Document>>(getRepositoryToken(Document));
  });

  it('should create a document', async () => {
    const document = { id: 1, title: 'Test Doc', filePath: 'uploads/test.pdf', uploadedBy: 1 };
    jest.spyOn(repo, 'save').mockResolvedValue(document);

    expect(await service.createDocument('Test Doc', document as any, 1)).toEqual(document);
  });
});
