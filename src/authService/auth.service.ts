import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.services';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(email: string, password: string, role: 'admin' | 'editor' | 'viewer') {
    return this.usersService.createUser(email, password, role);
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
  
    if (!user) throw new UnauthorizedException('Invalid credentials');
  
    const isPasswordValid = await bcrypt.compare(password, user.password);
  
    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');
  
    const token = this.generateToken(user);
    return { access_token: token };
  }
  
  generateToken(user: { id: number; email: string; role: string }): string {
    return this.jwtService.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });
  }

  async logout() {
    return { message: 'Logout successful' };
  }
}
