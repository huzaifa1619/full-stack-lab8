import { Matches } from 'class-validator';
import { Upper } from './transforms';

export class CodeParamDto {
  @Upper()
  @Matches(/^CS-\d{3}L?$/, { message: 'code must look like CS-301 or CS-301L' })
  code: string;
}
