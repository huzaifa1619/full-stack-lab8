import { Controller, Get, Inject } from '@nestjs/common';
import { FeesService } from './fees.service';

@Controller('fees/info')
export class FeesInfoController {
  // Injected through the useExisting alias, not through the class itself.
  constructor(@Inject('FEE_CALCULATOR') private readonly calculator: FeesService) {}

  @Get()
  info() {
    return this.calculator.info();
  }
}
