import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Department } from '../../common/department.enum';
import { LowerEach, Trim, Upper } from '../../common/transforms';

export class CreateCourseDto {
  @Upper()
  @Matches(/^CS-\d{3}L?$/, { message: 'code must look like CS-301 or CS-301L' })
  code: string;

  @Trim()
  @IsString({ message: 'title must be a string' })
  @MinLength(3, { message: 'title must be at least 3 characters' })
  title: string;

  @IsInt({ message: 'creditHours must be a whole number' })
  @Min(1, { message: 'creditHours must be at least 1' })
  @Max(4, { message: 'creditHours must be at most 4' })
  creditHours: number;

  @Trim()
  @IsString({ message: 'instructor must be a string' })
  @MinLength(3, { message: 'instructor must be at least 3 characters' })
  instructor: string;

  @IsEnum(Department, {
    message: `department must be one of: ${Object.values(Department).join(', ')}`,
  })
  department: Department;

  @IsOptional()
  @Trim()
  @IsString({ message: 'description must be a string' })
  @MaxLength(200, { message: 'description must be at most 200 characters' })
  description?: string;

  @IsOptional()
  @LowerEach()
  @IsArray({ message: 'tags must be an array' })
  @ArrayMaxSize(5, { message: 'tags can have at most 5 items' })
  @IsString({ each: true, message: 'each tag must be a string' })
  tags?: string[];
}
