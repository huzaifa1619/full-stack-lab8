import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { createValidationPipe } from '../src/common/validation';
import { Department } from '../src/common/department.enum';
import { COURSE_STORE, InMemoryCourseStore } from '../src/courses/store/course-store';

describe('Courses (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const store = new InMemoryCourseStore([
      { code: 'CS-101', title: 'Programming', creditHours: 3, instructor: 'Dr. A', department: Department.CS },
      { code: 'CS-201', title: 'Data Structures', creditHours: 4, instructor: 'Dr. B', department: Department.CS },
    ]);
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(COURSE_STORE)
      .useValue(store)
      .compile();
    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(createValidationPipe());
    await app.init();
  });

  afterEach(() => app.close());

  it('GET /api/courses returns the list', async () => {
    const res = await request(app.getHttpServer()).get('/api/courses').expect(200);
    expect(res.body).toHaveLength(2);
  });

  it('GET /api/courses/stats is not mistaken for a code', async () => {
    const res = await request(app.getHttpServer()).get('/api/courses/stats').expect(200);
    expect(res.body).toEqual({ totalCourses: 2, totalCredits: 7, overloaded: false });
  });

  it('POST cleans values and returns 201', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/courses')
      .send({ code: ' cs-420 ', title: '  Compilers ', creditHours: 3,
        instructor: 'Dr. Hamza Rauf', department: 'Computer Science', tags: ['Theory', 'CORE'] })
      .expect(201);
    expect(res.body).toMatchObject({ code: 'CS-420', title: 'Compilers', tags: ['theory', 'core'] });
  });

  it('POST invalid body returns 400 with details', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/courses')
      .send({ code: 'CS3', title: 'AI', creditHours: 9, instructor: 'Dr. Hamza', department: 'Data Science' })
      .expect(400);
    expect(res.body.details).toEqual([
      'code must look like CS-301 or CS-301L',
      'title must be at least 3 characters',
      'creditHours must be at most 4',
    ]);
  });

  it('POST duplicate code returns 409', async () => {
    await request(app.getHttpServer())
      .post('/api/courses')
      .send({ code: 'CS-101', title: 'Again', creditHours: 3, instructor: 'Dr. X', department: 'Computer Science' })
      .expect(409);
  });

  it('GET unknown course returns 404, bad code returns 400', async () => {
    await request(app.getHttpServer()).get('/api/courses/CS-999').expect(404);
    await request(app.getHttpServer()).get('/api/courses/abc').expect(400);
  });

  it('PATCH with code returns 400 (whitelist)', async () => {
    await request(app.getHttpServer()).patch('/api/courses/CS-101').send({ code: 'CS-999' }).expect(400);
  });

  it('DELETE returns 204 and the course is gone', async () => {
    await request(app.getHttpServer()).delete('/api/courses/CS-101').expect(204);
    await request(app.getHttpServer()).get('/api/courses/CS-101').expect(404);
  });
});
