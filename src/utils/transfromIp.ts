import geoip from 'geoip-lite';
export function transformIP(req: Request) {
  // 获取ip地址以及物理地理地址
  let ip = '0.0.0.0';
  const headers = req.headers;
  if (headers['x-real-ip']) {
    ip = headers['x-real-ip'] as string;
  }
  if (headers['x-forwarded-for']) {
    const ipList = (headers['x-forwarded-for'] as string).split(',');
    ip = ipList[0];
  }
  const result: Partial<TTransformIP> = {};
  result.ip = ip;
  result.agent = req.headers['user-agent'];

  const ip_location = geoip.lookup(ip);
  if (ip_location) {
    result.city = ip_location.city;
    result.range = ip_location.range;
    result.country = ip_location.country;
    if (Array.isArray(result.agent)) {
      const range = result.range as any;
      result.range = range.join(',');
    }
  }

  return result;
}

type TTransformIP = {
  ip: string;
  agent: string;
  city: string;
  range: string;
  country: string;
};
