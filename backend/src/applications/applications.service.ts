import { Injectable, ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateApplicationDto } from './dto/create-application.dto.js';
import { UpdateStatusDto } from './dto/update-status.dto.js';

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  async apply(jobSeekerId: string, dto: CreateApplicationDto) {
    const job = await this.prisma.job.findUnique({
      where: { id: dto.jobId },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    const existing = await this.prisma.application.findUnique({
      where: {
        jobId_jobSeekerId: {
          jobId: dto.jobId,
          jobSeekerId,
        },
      },
    });

    if (existing) {
      throw new ConflictException('You have already applied to this job');
    }

    const application = await this.prisma.application.create({
      data: {
        jobId: dto.jobId,
        jobSeekerId,
      },
      include: {
        job: { select: { title: true, location: true } },
      },
    });

    await this.prisma.applicationHistory.create({
      data: {
        applicationId: application.id,
        status: application.status,
      },
    });

    return application;
  }

  async findMyApplications(jobSeekerId: string) {
    return this.prisma.application.findMany({
      where: { jobSeekerId },
      include: {
        job: {
          select: {
            title: true,
            location: true,
            salary: true,
            jobType: true,
            company: { select: { companyName: true } },
          },
        },
      },
      orderBy: { appliedAt: 'desc' },
    });
  }

  async findApplicantsForJob(userId: string, jobId: string) {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
      include: { company: true },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (job.company.userId !== userId) {
      throw new ForbiddenException('You do not own this job');
    }

    return this.prisma.application.findMany({
      where: { jobId },
      include: {
        jobSeeker: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { appliedAt: 'desc' },
    });
  }

  async updateStatus(userId: string, applicationId: string, dto: UpdateStatusDto) {
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: { job: { include: { company: true } } },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    if (application.job.company.userId !== userId) {
      throw new ForbiddenException('You do not own this job');
    }

    const updated = await this.prisma.application.update({
      where: { id: applicationId },
      data: { status: dto.status },
    });

    await this.prisma.applicationHistory.create({
      data: {
        applicationId: application.id,
        status: dto.status,
        note: dto.note,
      },
    });

    return updated;
  }
}