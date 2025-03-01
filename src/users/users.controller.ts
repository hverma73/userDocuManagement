import { Controller, Get, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { UsersService } from '../users/users.services';
import { JwtAuthGuard } from '../authService/admin.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Admin can view all users
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllUsers() {
    return this.usersService.findAllUsers();
  }

  // Admin can update user roles
  @UseGuards(JwtAuthGuard)
  @Patch(':id/role')
  async updateUserRole(@Param('id') id: number, @Body() body: { role: 'admin' | 'editor' | 'viewer' }) {
    return this.usersService.updateUserRole(id, body.role);
  }

  // Admin can delete users
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteUser(@Param('id') id: number) {
    return this.usersService.deleteUser(id);
  }
}
