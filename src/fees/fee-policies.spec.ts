import { MeritFeePolicy, StandardFeePolicy } from './fee-policy';

const RATE = 5000;

describe('StandardFeePolicy', () => {
  const policy = new StandardFeePolicy();

  it('is creditHours x rate', () => {
    expect(policy.calculate(12, 3.9, RATE)).toBe(60000);
  });

  it('ignores the CGPA', () => {
    expect(policy.calculate(6, 2.0, RATE)).toBe(policy.calculate(6, 4.0, RATE));
  });
});

describe('MeritFeePolicy', () => {
  const policy = new MeritFeePolicy();

  it('gives 50% off at CGPA 3.5 (boundary)', () => {
    expect(policy.calculate(12, 3.5, RATE)).toBe(30000);
  });

  it('gives 50% off above 3.5', () => {
    expect(policy.calculate(12, 3.8, RATE)).toBe(30000);
  });

  it('gives 25% off just below 3.5', () => {
    expect(policy.calculate(12, 3.49, RATE)).toBe(45000);
  });

  it('gives 25% off at CGPA 3.0 (boundary)', () => {
    expect(policy.calculate(12, 3.0, RATE)).toBe(45000);
  });

  it('gives no discount below 3.0', () => {
    expect(policy.calculate(12, 2.99, RATE)).toBe(60000);
  });
});
