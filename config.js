import 'dotenv/config';

export const config = {
  apiKey: process.env.O1_API_KEY,
  baseUrl: (process.env.O1_API_BASE_URL || 'https://api.o1.exchange').replace(/\/$/, ''),
  chain: process.env.O1_CHAIN || 'base',
  port: parseInt(process.env.PORT || '4100', 10),
  refreshIntervalSeconds: parseInt(process.env.REFRESH_INTERVAL_SECONDS || '60', 10),
};

if (!config.apiKey) {
  throw new Error('O1_API_KEY tanimli degil. .env dosyasini kontrol edin.');
}
