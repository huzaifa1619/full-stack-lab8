import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateCourseDto } from './create-course.dto';

// code is omitted: with forbidNonWhitelisted, sending "code" gives 400.
export class UpdateCourseDto extends PartialType(
  OmitType(CreateCourseDto, ['code'] as const),
) {}
