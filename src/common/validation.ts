import { BadRequestException, ValidationPipe } from '@nestjs/common';
import type { ValidationError } from '@nestjs/common';

function flatten(errors: ValidationError[]): string[] {
  return errors.flatMap((e) => [
    ...Object.values(e.constraints ?? {}),
    ...flatten(e.children ?? []),
  ]);
}

/** Global pipe from the manual: whitelist + forbidNonWhitelisted + transform. */
export function createValidationPipe(): ValidationPipe {
  return new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    exceptionFactory: (errors) =>
      new BadRequestException({
        statusCode: 400,
        error: 'Validation failed',
        details: flatten(errors),
      }),
  });
}
