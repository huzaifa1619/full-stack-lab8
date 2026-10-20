import { Transform } from 'class-transformer';

/** Trims strings; leaves other values alone so validators can reject them. */
export const Trim = () =>
  Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  );

export const Upper = () =>
  Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toUpperCase() : value,
  );

/** Lower-cases every tag in an array (the "each: true" rule). */
export const LowerEach = () =>
  Transform(({ value }: { value: unknown }) =>
    Array.isArray(value)
      ? value.map((v: unknown) =>
          typeof v === 'string' ? v.trim().toLowerCase() : v,
        )
      : value,
  );
