import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { StudentsModule } from './students/students.module';
import { CoursesModule } from './courses/courses.module';
import { FeesModule } from './fees/fees.module';

@Module({
  imports: [CoreModule, StudentsModule, CoursesModule, FeesModule],
})
export class AppModule {}
