import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateCourseDto } from './create-course.dto';

const valid = {
  code: 'CS-301', title: 'Web Development', creditHours: 3,
  instructor: 'Dr. Hamza Rauf', department: 'Computer Science',
};

async function check(plain: object, whitelist = false) {
  const dto = plainToInstance(CreateCourseDto, plain);
  const errors = await validate(dto, whitelist ? { whitelist: true, forbidNonWhitelisted: true } : {});
  return { dto, messages: errors.flatMap((e) => Object.values(e.constraints ?? {})) };
}

describe('CreateCourseDto', () => {
  it('accepts valid data', async () => {
    expect((await check(valid)).messages).toEqual([]);
  });

  it('cleans values (trim, upper-case code, lower-case tags)', async () => {
    const { dto, messages } = await check({
      ...valid, code: ' cs-420 ', title: '  Compilers ', tags: ['Theory', 'CORE'],
    });
    expect(messages).toEqual([]);
    expect(dto.code).toBe('CS-420');
    expect(dto.title).toBe('Compilers');
    expect(dto.tags).toEqual(['theory', 'core']);
  });

  it('reports every invalid field with its custom message', async () => {
    const { messages } = await check({
      code: 'CS3', title: 'AI', creditHours: 9, instructor: 'Dr', department: 'Art',
    });
    expect(messages).toEqual(expect.arrayContaining([
      'code must look like CS-301 or CS-301L',
      'title must be at least 3 characters',
      'creditHours must be at most 4',
      'instructor must be at least 3 characters',
      expect.stringContaining('department must be one of'),
    ]));
  });

  it('rejects a number sent as text', async () => {
    const { messages } = await check({ ...valid, creditHours: '3' });
    expect(messages).toContain('creditHours must be a whole number');
  });

  it('rejects an extra property when forbidNonWhitelisted is on', async () => {
    const { messages } = await check({ ...valid, isAdmin: true }, true);
    expect(messages).toContain('property isAdmin should not exist');
  });

  it('rejects more than 5 tags', async () => {
    const { messages } = await check({ ...valid, tags: ['a', 'b', 'c', 'd', 'e', 'f'] });
    expect(messages).toContain('tags can have at most 5 items');
  });

  it('rejects non-string tags', async () => {
    const { messages } = await check({ ...valid, tags: ['ok', 5] });
    expect(messages).toContain('each tag must be a string');
  });

  it('rejects a description longer than 200 characters', async () => {
    const { messages } = await check({ ...valid, description: 'x'.repeat(201) });
    expect(messages).toContain('description must be at most 200 characters');
  });
});
