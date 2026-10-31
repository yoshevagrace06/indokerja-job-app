import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApplicationStatus } from '../../generated/prisma';

export class UpdateStatusDto {
  @IsEnum(ApplicationStatus)
  status: ApplicationStatus;

  @IsOptional()
  @IsString()
  note?: string;
}