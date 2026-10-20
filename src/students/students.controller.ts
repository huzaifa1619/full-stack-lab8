import { Controller, Get, Param } from '@nestjs/common';
import { StudentsService } from './students.service';

@Controller('students')
export class StudentsController {
  constructor(private readonly students: StudentsService) {}

  @Get()
  findAll() {
    return this.students.findAll();
  }

  @Get(':rollNumber')
  findOne(@Param('rollNumber') rollNumber: string) {
    return this.students.findOne(rollNumber);
  }
}
