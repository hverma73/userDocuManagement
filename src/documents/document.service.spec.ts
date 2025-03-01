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
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DocumentsService>(DocumentsService);
    repo = module.get<Repository<Document>>(getRepositoryToken(Document));
  });

  it('should create a document', async () => {
    const document = { id: 1, title: 'Test Doc', content: 'Sample Content', uploadedBy: 1 };

    jest.spyOn(repo, 'create').mockReturnValue(document as any);
    jest.spyOn(repo, 'save').mockResolvedValue(document);

    const result = await service.createDocument('Test Doc', 'Sample Content', 1);
    
    expect(repo.create).toHaveBeenCalledWith({ title: 'Test Doc', content: 'Sample Content', uploadedBy: 1 });
    expect(repo.save).toHaveBeenCalledWith(document);
    expect(result).toEqual(document);
  });

  it('should get all documents', async () => {
    const documents = [
      { id: 1, title: 'Doc 1', content: 'Content 1', uploadedBy: 1 },
      { id: 2, title: 'Doc 2', content: 'Content 2', uploadedBy: 2 },
    ];

    jest.spyOn(repo, 'find').mockResolvedValue(documents);

    const result = await service.getDocuments();

    expect(repo.find).toHaveBeenCalled();
    expect(result).toEqual(documents);
  });

  it('should get a document by ID', async () => {
    const document = { id: 1, title: 'Doc 1', content: 'Content 1', uploadedBy: 1 };

    jest.spyOn(repo, 'findOne').mockResolvedValue(document);

    const result = await service.getDocumentById(1);

    expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(result).toEqual(document);
  });

  it('should update a document', async () => {
    const updatedDocument = { id: 1, title: 'Updated Doc', content: 'Updated Content', uploadedBy: 1 };

    jest.spyOn(repo, 'update').mockResolvedValue({ affected: 1 } as any);
    jest.spyOn(service, 'getDocumentById').mockResolvedValue(updatedDocument);

    const result = await service.updateDocument(1, 'Updated Doc', 'Updated Content');

    expect(repo.update).toHaveBeenCalledWith(1, { title: 'Updated Doc', content: 'Updated Content' });
    expect(service.getDocumentById).toHaveBeenCalledWith(1);
    expect(result).toEqual(updatedDocument);
  });

  it('should delete a document', async () => {
    jest.spyOn(repo, 'delete').mockResolvedValue({ affected: 1 } as any);

    const result = await service.deleteDocument(1);

    expect(repo.delete).toHaveBeenCalledWith(1);
    expect(result).toEqual({ affected: 1 });
  });
});
