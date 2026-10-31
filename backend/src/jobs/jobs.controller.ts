import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { JobsService } from './jobs.service.js';
import { CreateJobDto } from './dto/create-job.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { Role } from '../generated/prisma';

@Controller('jobs')
export class JobsController {
  constructor(private jobsService: JobsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.COMPANY)
  @Post()
  async create(@CurrentUser() user: { userId: string }, @Body() dto: CreateJobDto) {
    return this.jobsService.create(user.userId, dto);
  }

  @Get()
  async findAll() {
    return this.jobsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.COMPANY)
  @Patch(':id/toggle')
  async toggleStatus(
    @CurrentUser() user: { userId: string },
    @Param('id') id: string,
  ) {
    return this.jobsService.toggleStatus(user.userId, id);
  }
}