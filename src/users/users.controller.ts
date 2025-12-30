import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Request,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('admin')
  findAll() {
    return this.usersService.findAll();
  }

  @Patch(':id/role')
  @Roles('admin')
  async updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
    @Request() req,
  ) {
    // Check if req.user exists and has userId (checked in strategy next)
    if (req.user.userId === id) {
       throw new ForbiddenException('Cannot change your own role');
    }
    const user = await this.usersService.findById(id);
    if (!user) throw new NotFoundException('User not found');
    
    return this.usersService.updateRole(id, updateUserRoleDto.role);
  }

  @Patch(':id/status')
  @Roles('admin')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserStatusDto: UpdateUserStatusDto,
    @Request() req,
  ) {
    if (req.user.userId === id) {
      throw new ForbiddenException('Cannot block yourself');
    }
    const user = await this.usersService.findById(id);
    if (!user) throw new NotFoundException('User not found');

    return this.usersService.updateStatus(id, updateUserStatusDto.status);
  }

  @Delete(':id')
  @Roles('admin')
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    if (req.user.userId === id) {
      throw new ForbiddenException('Cannot delete yourself');
    }
    const user = await this.usersService.findById(id);
    if (!user) throw new NotFoundException('User not found');

    return this.usersService.remove(id);
  }
}
