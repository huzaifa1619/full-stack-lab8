import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { Course } from '../course.entity';

// Symbol token: an interface vanishes at runtime, so the store is found by this value.
export const COURSE_STORE = Symbol('COURSE_STORE');

export interface CourseStore {
  readAll(): Course[];
  writeAll(courses: Course[]): void;
}

export const COURSES_FILE = join(process.cwd(), 'data', 'courses.json');

export class InMemoryCourseStore implements CourseStore {
  private courses: Course[];

  constructor(initial: Course[] = []) {
    this.courses = initial.map((c) => ({ ...c }));
  }

  readAll(): Course[] {
    return this.courses.map((c) => ({ ...c }));
  }

  writeAll(courses: Course[]): void {
    this.courses = courses.map((c) => ({ ...c }));
  }
}

export class JsonFileCourseStore implements CourseStore {
  constructor(private readonly file: string = COURSES_FILE) {}

  readAll(): Course[] {
    return JSON.parse(readFileSync(this.file, 'utf-8')) as Course[];
  }

  writeAll(courses: Course[]): void {
    writeFileSync(this.file, JSON.stringify(courses, null, 2));
  }
}
