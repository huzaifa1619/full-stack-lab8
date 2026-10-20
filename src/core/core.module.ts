import { Global, Module } from '@nestjs/common';
import { APP_CONFIG, loadAppConfig } from './app-config';
import { AppLogger } from './app-logger';

@Global()
@Module({
  providers: [{ provide: APP_CONFIG, useFactory: loadAppConfig }, AppLogger],
  exports: [APP_CONFIG, AppLogger],
})
export class CoreModule {}
