import { Department } from '../common/department.enum';

export interface Course {
  code: string;
  title: string;
  creditHours: number;
  instructor: string;
  department: Department;
  description?: string;
  tags?: string[];
}
