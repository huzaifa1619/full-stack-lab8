import { Controller, Get, Param, Query } from '@nestjs/common';
import { FeeQueryDto } from './dto/fee-query.dto';
import { FeesService } from './fees.service';

@Controller('fees')
export class FeesController {
  constructor(private readonly fees: FeesService) {}

  @Get(':rollNumber')
  calculate(@Param('rollNumber') rollNumber: string, @Query() { creditHours }: FeeQueryDto) {
    return this.fees.calculate(rollNumber, creditHours);
  }
}
