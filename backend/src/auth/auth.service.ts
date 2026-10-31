import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from '../generated/prisma';

const MAX_ATTEMPTS = 3;
const LOCKOUT_MINUTES = 15;

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
        role: dto.role,
        ...(dto.role === Role.COMPANY && dto.companyName
          ? {
              company: {
                create: {
                  companyName: dto.companyName,
                },
              },
            }
          : {}),
      },
      include: { company: true },
    });

    const { password, ...result } = user;
    return this.generateToken(result.id, result.email, result.role, result);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { company: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const minutesLeft = Math.ceil(
        (user.lockedUntil.getTime() - Date.now()) / 60000,
      );
      throw new UnauthorizedException(
        `Account temporarily locked. Try again in ${minutesLeft} minute(s).`,
      );
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      const attempts = user.failedLoginAttempts + 1;

      if (attempts >= MAX_ATTEMPTS) {
        await this.prisma.user.update({
          where: { id: user.id },
          data: {
            failedLoginAttempts: 0,
            lockedUntil: new Date(Date.now() + LOCKOUT_MINUTES * 60000),
          },
        });
        throw new UnauthorizedException(
          `Too many failed attempts. Account locked for ${LOCKOUT_MINUTES} minutes.`,
        );
      }

      await this.prisma.user.update({
        where: { id: user.id },
        data: { failedLoginAttempts: attempts },
      });

      const remaining = MAX_ATTEMPTS - attempts;
      throw new UnauthorizedException(
        `Invalid credentials. ${remaining} attempt(s) remaining before lockout.`,
      );
    }

    if (user.failedLoginAttempts > 0 || user.lockedUntil) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { failedLoginAttempts: 0, lockedUntil: null },
      });
    }

    const { password, ...result } = user;
    return this.generateToken(result.id, result.email, result.role, result);
  }

  private generateToken(userId: string, email: string, role: Role, userData: any) {
    const payload = { sub: userId, email, role };
    return {
      access_token: this.jwtService.sign(payload),
      user: userData,
    };
  }
}