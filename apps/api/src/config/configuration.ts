export interface AppConfig {
  port: number;
  webOrigin: string;
  database: {
    host: string;
    port: number;
    username: string;
    password: string;
    name: string;
  };
}

export default (): AppConfig => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  webOrigin: process.env.WEB_ORIGIN ?? 'http://localhost:5173',
  database: {
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    username: process.env.DB_USER ?? 'decathlon',
    password: process.env.DB_PASSWORD ?? 'decathlon',
    name: process.env.DB_NAME ?? 'decathlon',
  },
});
