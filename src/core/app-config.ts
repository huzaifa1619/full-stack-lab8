// String token (taught in the manual): a plain config object is injected by name.
export const APP_CONFIG = 'APP_CONFIG';

export interface AppConfig {
  storage: 'file' | 'memory';
  logToFile: boolean;
}

export function loadAppConfig(): AppConfig {
  return {
    storage: process.env.STORAGE === 'memory' ? 'memory' : 'file',
    logToFile: process.env.LOG_TO_FILE === 'true',
  };
}
