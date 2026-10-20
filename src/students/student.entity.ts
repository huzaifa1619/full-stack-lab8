import { Department } from '../common/department.enum';

export interface Student {
  rollNumber: string;
  name: string;
  cgpa: number;
  department: Department;
}
