import devConfig from './dev.config';
import prdConfig from './prd.config';

const envConfig = process.env.APP_ENV === 'dev' ? devConfig : prdConfig;

export default envConfig;
