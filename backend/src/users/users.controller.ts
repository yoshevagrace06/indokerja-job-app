import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateCompanyDto } from './dto/create-company.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyProfile(@CurrentUser() user: { userId: string }) {
    return this.usersService.getProfile(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('company')
  async createCompanyProfile(
    @CurrentUser() user: { userId: string },
    @Body() dto: CreateCompanyDto,
  ) {
    return this.usersService.createCompanyProfile(user.userId, dto);
  }
}