import { Type } from 'class-transformer';
import { IsEnum, IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Department } from '../../common/department.enum';
import { Trim } from '../../common/transforms';

export class QueryCourseDto {
  @IsOptional()
  @Trim()
  @IsString({ message: 'search must be a string' })
  search?: string;

  @IsOptional()
  @IsEnum(Department, {
    message: `department must be one of: ${Object.values(Department).join(', ')}`,
  })
  department?: Department;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'minCredits must be a whole number' })
  @Min(1, { message: 'minCredits must be at least 1' })
  @Max(4, { message: 'minCredits must be at most 4' })
  minCredits?: number;

  @IsOptional()
  @IsIn(['creditHours'], { message: 'sort must be creditHours' })
  sort?: 'creditHours';

  @IsOptional()
  @IsIn(['asc', 'desc'], { message: 'order must be asc or desc' })
  order?: 'asc' | 'desc';

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'limit must be a whole number' })
  @Min(1, { message: 'limit must be at least 1' })
  @Max(50, { message: 'limit must be at most 50' })
  limit?: number;
}
