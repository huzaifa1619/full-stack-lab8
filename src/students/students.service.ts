import { Injectable, NotFoundException } from '@nestjs/common';
import { Department } from '../common/department.enum';
import { Student } from './student.entity';

@Injectable()
export class StudentsService {
  private readonly students: Student[] = [
    { rollNumber: 'BSCS-023', name: 'Sara Ahmed', cgpa: 3.8, department: Department.CS },
    { rollNumber: 'BSCS-045', name: 'Ali Raza', cgpa: 3.2, department: Department.CS },
    { rollNumber: 'BSSE-011', name: 'Hina Khan', cgpa: 2.7, department: Department.SE },
    { rollNumber: 'BSDS-007', name: 'Bilal Sheikh', cgpa: 3.5, department: Department.DS },
  ];

  findAll(): Student[] {
    return this.students;
  }

  findOne(rollNumber: string): Student {
    const student = this.students.find((s) => s.rollNumber === rollNumber);
    if (!student) throw new NotFoundException(`Student ${rollNumber} not found`);
    return student;
  }
}
