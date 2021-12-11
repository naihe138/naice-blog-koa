import { createHash } from 'crypto';
import envConfig from 'src/config/configuration';

export const config = envConfig();
export function isDev(): boolean {
  return process.env.APP_ENV === 'dev' ? true : false;
}

export function getEnv(key: string): string {
  return key.split('.').reduce((c, i) => c[i], config);
}

export const md5Decode = (pwd) => createHash('md5').update(pwd).digest('hex');

export const resSuccess = (result, message) => ({
  message: message + 'success',
  result,
  code: 0,
});

export const resError = (error, message) => ({
  message: message + 'fail',
  error,
  code: 1,
});

export const privateRes = {
  resSuccess,
  resError,
};
