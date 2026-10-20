import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AppLogger } from '../core/app-logger';
import { Course } from './course.entity';
import { CreditService } from './credit.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { QueryCourseDto } from './dto/query-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { COURSE_STORE } from './store/course-store';
import type { CourseStore } from './store/course-store';

@Injectable()
export class CoursesService {
  constructor(
    @Inject(COURSE_STORE) private readonly store: CourseStore,
    private readonly credits: CreditService,
    private readonly logger: AppLogger,
  ) {}

  findAll(query: QueryCourseDto = {}): Course[] {
    let list = this.store.readAll();

    if (query.search) {
      const s = query.search.toLowerCase();
      list = list.filter((c) =>
        [c.code, c.title, c.instructor].some((v) => v.toLowerCase().includes(s)),
      );
    }
    if (query.department) list = list.filter((c) => c.department === query.department);
    if (query.minCredits) list = list.filter((c) => c.creditHours >= query.minCredits!);
    if (query.sort === 'creditHours') {
      const dir = query.order === 'desc' ? -1 : 1;
      list = [...list].sort((a, b) => (a.creditHours - b.creditHours) * dir);
    }
    if (query.limit) list = list.slice(0, query.limit);
    return list;
  }

  stats() {
    const courses = this.store.readAll();
    const totalCredits = this.credits.totalCredits(courses);
    return {
      totalCourses: courses.length,
      totalCredits,
      overloaded: this.credits.isOverloaded(totalCredits),
    };
  }

  findOne(code: string): Course {
    const course = this.store.readAll().find((c) => c.code === code);
    if (!course) throw new NotFoundException(`Course ${code} not found`);
    return course;
  }

  create(dto: CreateCourseDto): Course {
    const courses = this.store.readAll();
    if (courses.some((c) => c.code === dto.code)) {
      throw new ConflictException(`Course ${dto.code} already exists`);
    }
    const course: Course = { ...dto };
    this.store.writeAll([...courses, course]);
    this.logger.log(`Created course ${course.code}`);
    return course;
  }

  update(code: string, dto: UpdateCourseDto): Course {
    const courses = this.store.readAll();
    const index = courses.findIndex((c) => c.code === code);
    if (index === -1) throw new NotFoundException(`Course ${code} not found`);
    const updated: Course = { ...courses[index], ...dto, code };
    courses[index] = updated;
    this.store.writeAll(courses);
    this.logger.log(`Updated course ${code}`);
    return updated;
  }

  remove(code: string): void {
    const courses = this.store.readAll();
    if (!courses.some((c) => c.code === code)) {
      throw new NotFoundException(`Course ${code} not found`);
    }
    this.store.writeAll(courses.filter((c) => c.code !== code));
    this.logger.log(`Deleted course ${code}`);
  }
}
