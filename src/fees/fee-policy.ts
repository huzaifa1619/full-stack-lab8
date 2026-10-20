// Symbol token for the policy. FeePolicy is only a type; it can't be a token.
export const FEE_POLICY = Symbol('FEE_POLICY');
export const FEE_RATE = 'FEE_RATE'; // string token

export interface FeePolicy {
  readonly name: string;
  calculate(creditHours: number, cgpa: number, ratePerCreditHour: number): number;
}

export class StandardFeePolicy implements FeePolicy {
  readonly name = 'standard';
  calculate(creditHours: number, _cgpa: number, ratePerCreditHour: number): number {
    return creditHours * ratePerCreditHour;
  }
}

export class MeritFeePolicy implements FeePolicy {
  readonly name = 'merit';
  calculate(creditHours: number, cgpa: number, ratePerCreditHour: number): number {
    const base = creditHours * ratePerCreditHour;
    if (cgpa >= 3.5) return base * 0.5;
    if (cgpa >= 3.0) return base * 0.75;
    return base;
  }
}
