import { Inject, Injectable } from '@nestjs/common';
import { appendFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { APP_CONFIG } from './app-config';
import type { AppConfig } from './app-config';

@Injectable()
export class AppLogger {
  constructor(@Inject(APP_CONFIG) private readonly config: AppConfig) {}

  log(message: string): void {
    const line = `[${new Date().toISOString()}] ${message}`;
    console.log(line);
    if (this.config.logToFile) {
      const dir = join(process.cwd(), 'logs');
      mkdirSync(dir, { recursive: true });
      appendFileSync(join(dir, 'app.log'), line + '\n');
    }
  }
}
