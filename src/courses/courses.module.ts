import { Module } from '@nestjs/common';
import { readFileSync } from 'fs';
import { APP_CONFIG } from '../core/app-config';
import type { AppConfig } from '../core/app-config';
import { AppLogger } from '../core/app-logger';
import { Course } from './course.entity';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { CreditService } from './credit.service';
import {
  COURSES_FILE,
  COURSE_STORE,
  CourseStore,
  InMemoryCourseStore,
  JsonFileCourseStore,
} from './store/course-store';

@Module({
  controllers: [CoursesController],
  providers: [
    CreditService,
    CoursesService,
    {
      provide: COURSE_STORE,
      inject: [APP_CONFIG, AppLogger],
      useFactory: (config: AppConfig, logger: AppLogger): CourseStore => {
        if (config.storage === 'memory') {
          logger.log('Using memory storage');
          const seed = JSON.parse(readFileSync(COURSES_FILE, 'utf-8')) as Course[];
          return new InMemoryCourseStore(seed);
        }
        logger.log('Using file storage');
        return new JsonFileCourseStore();
      },
    },
  ],
  exports: [CoursesService],
})
export class CoursesModule {}
