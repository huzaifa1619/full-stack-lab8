import { Inject, Injectable } from '@nestjs/common';
import { StudentsService } from '../students/students.service';
import { FEE_POLICY, FEE_RATE } from './fee-policy';
import type { FeePolicy } from './fee-policy';

@Injectable()
export class FeesService {
  constructor(
    @Inject(FEE_POLICY) private readonly policy: FeePolicy,
    @Inject(FEE_RATE) private readonly rate: number,
    private readonly students: StudentsService,
  ) {}

  info() {
    return { policy: this.policy.name, ratePerCreditHour: this.rate };
  }

  calculate(rollNumber: string, creditHours: number) {
    const student = this.students.findOne(rollNumber); // 404 if unknown
    return {
      rollNumber: student.rollNumber,
      name: student.name,
      cgpa: student.cgpa,
      creditHours,
      policy: this.policy.name,
      ratePerCreditHour: this.rate,
      total: this.policy.calculate(creditHours, student.cgpa, this.rate),
    };
  }
}
