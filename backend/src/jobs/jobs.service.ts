import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateJobDto } from './dto/create-job.dto.js';

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateJobDto) {
    const company = await this.prisma.company.findUnique({
      where: { userId },
    });

    if (!company) {
      throw new ForbiddenException('Only users with a company profile can create jobs');
    }

    return this.prisma.job.create({
      data: {
        ...dto,
        companyId: company.id,
      },
    });
  }

  async findAll() {
    return this.prisma.job.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        company: {
          select: { companyName: true },
        },
      },
    });
  }

  async findOne(id: string) {
    const job = await this.prisma.job.findUnique({
      where: { id },
      include: {
        company: {
          select: { companyName: true, description: true, userId: true },
        },
      },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    return job;
  }

  async toggleStatus(userId: string, jobId: string) {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
      include: { company: true },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (job.company.userId !== userId) {
      throw new ForbiddenException('You are not the owner of this job');
    }

    return this.prisma.job.update({
      where: { id: jobId },
      data: { isOpen: !job.isOpen },
    });
  }
}