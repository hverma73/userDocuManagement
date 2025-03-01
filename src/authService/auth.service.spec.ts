import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.services';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

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
            sign: jest.fn().mockReturnValue('mock_token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should register a user', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    const role = 'admin';

    usersService.createUser = jest.fn().mockResolvedValue({
      id: 1,
      email,
      password: await bcrypt.hash(password, 10),
      role,
    });

    const result = await service.register(email, password, role);

    expect(usersService.createUser).toHaveBeenCalledWith(email, password, role);
    expect(result).toHaveProperty('id');
    expect(result.email).toBe(email);
  });

  it('should login successfully', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);

    usersService.findByEmail = jest.fn().mockResolvedValue({
      id: 1,
      email,
      password: hashedPassword,
      role: 'admin',
    });

    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

    const result = await service.login(email, password);

    expect(usersService.findByEmail).toHaveBeenCalledWith(email);
    expect(result).toEqual({ access_token: 'mock_token' });
  });

  it('should throw error on invalid login credentials', async () => {
    usersService.findByEmail = jest.fn().mockResolvedValue(null);

    await expect(service.login('test@example.com', 'wrongpassword')).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should logout successfully', async () => {
    const result = await service.logout();
    expect(result).toEqual({ message: 'Logout successful' });
  });

  it('should generate JWT token', () => {
    const user = { id: 1, email: 'admin@example.com', role: 'admin' };
    const token = service.generateToken(user);

    expect(token).toBe('mock_token');
    expect(jwtService.sign).toHaveBeenCalledWith(user);
  });
});
