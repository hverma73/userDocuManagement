import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.services';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';

describe('UsersService', () => {
    let userService: UsersService;
    let userRepository: Repository<User>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: getRepositoryToken(User),
                    useClass: Repository, // Mocking TypeORM Repository
                },
            ],
        }).compile();

        userService = module.get<UsersService>(UsersService);
        userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    });

    it('should create a new user', async () => {
        const userData = { email: 'test@example.com', password: 'hashedpassword', role: 'viewer' };
        const createdUser = { ...userData, password: 'hashedpassword' } as User; // Simulating entity creation
    
        jest.spyOn(userRepository, 'create').mockReturnValue(createdUser); // ✅ Mocking `create()`
        jest.spyOn(userRepository, 'save').mockResolvedValue(createdUser);
    
        const result = await userService.createUser(userData.email, userData.password, 'viewer');
    
        expect(userRepository.create).toHaveBeenCalledWith({
            email: userData.email,
            password: expect.any(String), // Since password gets hashed
            role: 'viewer',
        });
    
        expect(userRepository.save).toHaveBeenCalledWith(createdUser);
        expect(result).toEqual(createdUser);
    });
    

    it('should return all users', async () => {
        const users = [{ id: 1, email: 'test@example.com', role: 'viewer' }];
        jest.spyOn(userRepository, 'find').mockResolvedValue(users as User[]);

        const result = await userService.findAllUsers();
        expect(result).toEqual(users);
    });

    it('should update a user role', async () => {
        const updatedUser = { id: 1, role: 'admin' };
        jest.spyOn(userRepository, 'findOne').mockResolvedValue(updatedUser as User);
        jest.spyOn(userRepository, 'save').mockResolvedValue(updatedUser as User);

        const result = await userService.updateUserRole(1, 'admin');
        expect(result).toEqual(updatedUser);
    });

    it('should delete a user', async () => {
        const user = { id: 1, email: 'test@example.com', role: 'viewer' } as User;

        jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
        jest.spyOn(userRepository, 'remove').mockResolvedValue(Promise.resolve(user)); //  Corrected

        await userService.deleteUser(1);

        expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
        expect(userRepository.remove).toHaveBeenCalledWith(user);
    });


});
