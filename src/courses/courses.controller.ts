import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CodeParamDto } from '../common/code-param.dto';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { QueryCourseDto } from './dto/query-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Controller('courses')
export class CoursesController {
  constructor(private readonly courses: CoursesService) {}

  @Get()
  findAll(@Query() query: QueryCourseDto) {
    return this.courses.findAll(query);
  }

  // Must stay above ':code', otherwise "stats" would be read as a course code.
  @Get('stats')
  stats() {
    return this.courses.stats();
  }

  @Get(':code')
  findOne(@Param() { code }: CodeParamDto) {
    return this.courses.findOne(code);
  }

  @Post()
  create(@Body() dto: CreateCourseDto) {
    return this.courses.create(dto); // 201 by default
  }

  @Put(':code')
  replace(@Param() { code }: CodeParamDto, @Body() dto: UpdateCourseDto) {
    return this.courses.update(code, dto);
  }

  @Patch(':code')
  update(@Param() { code }: CodeParamDto, @Body() dto: UpdateCourseDto) {
    return this.courses.update(code, dto);
  }

  @Delete(':code')
  @HttpCode(204)
  remove(@Param() { code }: CodeParamDto) {
    this.courses.remove(code);
  }
}
