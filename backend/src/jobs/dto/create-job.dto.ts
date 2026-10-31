import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { JobType } from '../../generated/prisma';

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsString()
  @IsNotEmpty()
  salary: string;

  @IsEnum(JobType)
  jobType: JobType;
}