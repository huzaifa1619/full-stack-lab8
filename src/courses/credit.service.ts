import { Injectable } from '@nestjs/common';
import { Course } from './course.entity';

export const MAX_CREDITS = 18;

@Injectable()
export class CreditService {
  totalCredits(courses: Course[]): number {
    return courses.reduce((sum, c) => sum + c.creditHours, 0);
  }

  isOverloaded(totalCredits: number): boolean {
    return totalCredits > MAX_CREDITS;
  }
}
