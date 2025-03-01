import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.services';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

describe('UsersService', () => {
  let service: UsersService;
  let repo: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should create a user', async () => {
    const email = 'test@example.com';
    const password = 'hash';
    const role: 'admin' | 'editor' | 'viewer' = 'admin';
  
    const user: User = { id: 1, email, password, role };
  
    jest.spyOn(repo, 'create').mockReturnValue(user as any); // Mock create()
    jest.spyOn(repo, 'save').mockResolvedValue(user); // Mock save()
  
    expect(await service.createUser(email, password, role)).toEqual(user);
  });
  
  
});
