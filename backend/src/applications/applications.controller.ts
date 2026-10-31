import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApplicationsService } from './applications.service.js';
import { CreateApplicationDto } from './dto/create-application.dto.js';
import { UpdateStatusDto } from './dto/update-status.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { Role } from '../generated/prisma';

@Controller('applications')
export class ApplicationsController {
  constructor(private applicationsService: ApplicationsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.JOB_SEEKER)
  @Post()
  async apply(@CurrentUser() user: { userId: string }, @Body() dto: CreateApplicationDto) {
    return this.applicationsService.apply(user.userId, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.JOB_SEEKER)
  @Get('me')
  async findMine(@CurrentUser() user: { userId: string }) {
    return this.applicationsService.findMyApplications(user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.COMPANY)
  @Get('job/:jobId')
  async findApplicants(
    @CurrentUser() user: { userId: string },
    @Param('jobId') jobId: string,
  ) {
    return this.applicationsService.findApplicantsForJob(user.userId, jobId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.COMPANY)
  @Patch(':id/status')
  async updateStatus(
    @CurrentUser() user: { userId: string },
    @Param('id') id: string,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.applicationsService.updateStatus(user.userId, id, dto);
  }
}