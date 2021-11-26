import { createHash } from 'crypto';
import envConfig from 'src/config/configuration';

const config = envConfig();
export function isDev(): boolean {
  return process.env.APP_ENV === 'dev' ? true : false;
}

export function getEnv(key: string): string {
  return key.split('.').reduce((c, i) => c[i], config);
}

export const md5Decode = (pwd) => createHash('md5').update(pwd).digest('hex');
