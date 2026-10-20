import { Module } from '@nestjs/common';
import { AppLogger } from '../core/app-logger';
import { StudentsModule } from '../students/students.module';
import { FeesController } from './fees.controller';
import { FeesInfoController } from './fees-info.controller';
import { FeesService } from './fees.service';
import {
  FEE_POLICY,
  FEE_RATE,
  FeePolicy,
  MeritFeePolicy,
  StandardFeePolicy,
} from './fee-policy';

@Module({
  imports: [StudentsModule],
  // FeesInfoController first, so /fees/info is matched before /fees/:rollNumber.
  controllers: [FeesInfoController, FeesController],
  providers: [
    FeesService,
    { provide: FEE_RATE, useValue: 5000 },
    {
      provide: FEE_POLICY,
      inject: [FEE_RATE, AppLogger],
      useFactory: (rate: number, logger: AppLogger): FeePolicy => {
        const name = process.env.FEE_POLICY === 'merit' ? 'merit' : 'standard';
        logger.log(`Using ${name} fee policy (rate ${rate} per credit hour)`);
        return name === 'merit' ? new MeritFeePolicy() : new StandardFeePolicy();
      },
    },
    { provide: 'FEE_CALCULATOR', useExisting: FeesService },
  ],
})
export class FeesModule {}
