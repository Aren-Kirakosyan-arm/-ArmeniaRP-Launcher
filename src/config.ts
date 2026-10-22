export const launcherConfig = {
  apiBaseUrl: 'http://localhost:8080',
  server: { host: '127.0.0.1', port: 7777 },
  version: '0.1.0',
  game: { executablePath: '' },
  apiTimeoutMs: 5000,
} as const;
