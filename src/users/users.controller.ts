import { Controller, Post, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from 'src/auth/dto/login.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller()
export class UsersController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  @Post('auth/register')
  register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  @Post('auth/login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/profile')
  getProfile(@Request() req) {
    return this.usersService.getProfile(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('user/profile')
  updateProfile(@Request() req, @Body() dto: UpdateUserDto) {
    return this.usersService.updateProfile(req.user.userId, dto);
  }
}
