export function isDev(): boolean {
  return process.env.APP_ENV === 'dev' ? true : false;
}
