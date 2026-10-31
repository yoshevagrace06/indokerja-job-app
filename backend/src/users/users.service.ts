import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        company: {
          select: {
            id: true,
            companyName: true,
            description: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async createCompanyProfile(userId: string, dto: CreateCompanyDto) {
    const existing = await this.prisma.company.findUnique({
      where: { userId },
    });

    if (existing) {
      throw new ConflictException('Company profile already exists for this user');
    }

    return this.prisma.company.create({
      data: {
        userId,
        companyName: dto.companyName,
        description: dto.description,
      },
    });
  }
}