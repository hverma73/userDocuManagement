import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../authService/auth.service';
import { UsersService } from '../users/users.services';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            createUser: jest.fn(),
            findByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(() => 'mocked-jwt-token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should generate JWT token', () => {
    const user = { id: 1, email: 'test@example.com', role: 'admin' };
    const token = service.generateToken(user);

    expect(token).toBe('mocked-jwt-token');
    expect(jwtService.sign).toHaveBeenCalledWith(user);
  });
});
