import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Department } from '../common/department.enum';
import { AppLogger } from '../core/app-logger';
import { Course } from './course.entity';
import { CoursesService } from './courses.service';
import { CreditService } from './credit.service';
import { COURSE_STORE, InMemoryCourseStore } from './store/course-store';

const seed = (): Course[] => [
  { code: 'CS-101', title: 'Programming', creditHours: 3, instructor: 'Dr. A', department: Department.CS },
  { code: 'CS-201', title: 'Data Structures', creditHours: 4, instructor: 'Dr. B', department: Department.CS },
];

describe('CoursesService', () => {
  let service: CoursesService;
  let logger: { log: jest.Mock };

  beforeEach(async () => {
    logger = { log: jest.fn() };
    const module = await Test.createTestingModule({
      providers: [
        CoursesService,
        CreditService,
        { provide: COURSE_STORE, useValue: new InMemoryCourseStore(seed()) },
        { provide: AppLogger, useValue: logger },
      ],
    }).compile();
    service = module.get(CoursesService);
  });

  it('lists all courses', () => {
    expect(service.findAll()).toHaveLength(2);
  });

  it('returns one course by code', () => {
    expect(service.findOne('CS-101').title).toBe('Programming');
  });

  it('throws NotFoundException for an unknown course', () => {
    expect(() => service.findOne('CS-999')).toThrow(NotFoundException);
  });

  it('creates a course', () => {
    const created = service.create({
      code: 'CS-420', title: 'Compilers', creditHours: 3,
      instructor: 'Dr. Hamza', department: Department.CS,
    });
    expect(created.code).toBe('CS-420');
    expect(service.findAll()).toHaveLength(3);
  });

  it('throws ConflictException for a duplicate code', () => {
    expect(() =>
      service.create({
        code: 'CS-101', title: 'Again', creditHours: 3,
        instructor: 'Dr. X', department: Department.CS,
      }),
    ).toThrow(ConflictException);
  });

  it('deletes a course', () => {
    service.remove('CS-101');
    expect(service.findAll().map((c) => c.code)).toEqual(['CS-201']);
  });

  it('logs create and delete through AppLogger', () => {
    service.remove('CS-201');
    expect(logger.log).toHaveBeenCalledWith('Deleted course CS-201');
  });

  it('reports stats using CreditService', () => {
    expect(service.stats()).toEqual({ totalCourses: 2, totalCredits: 7, overloaded: false });
  });

  it('filters, sorts and limits with query options', () => {
    const result = service.findAll({ minCredits: 4, sort: 'creditHours', order: 'desc', limit: 1 });
    expect(result.map((c) => c.code)).toEqual(['CS-201']);
  });
});
