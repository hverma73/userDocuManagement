import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  //  Find user by email
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  //  Create a new user with hashed password
  async createUser(email: string, password: string, role: 'admin' | 'editor' | 'viewer'): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({ email, password: hashedPassword, role });
    return this.userRepository.save(user);
  }

  //  Admin: Get all users
  async findAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  //  Admin: Update user role
  async updateUserRole(id: number, role: 'admin' | 'editor' | 'viewer'): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    
    user.role = role;
    return this.userRepository.save(user);
  }

  //  Admin: Delete user
  async deleteUser(id: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    
    await this.userRepository.remove(user);
  }
}
