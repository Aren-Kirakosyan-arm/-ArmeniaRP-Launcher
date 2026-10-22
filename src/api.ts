import { launcherConfig } from './config';
import type { NewsItem, ServerStatus } from './types';

export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(path: string): Promise<T> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), launcherConfig.apiTimeoutMs);
  try {
    const response = await fetch(`${launcherConfig.apiBaseUrl}${path}`, { signal: controller.signal });
    if (!response.ok) throw new ApiError(`HTTP ${response.status}`);
    try {
      return (await response.json()) as T;
    } catch {
      throw new ApiError('Некорректный JSON');
    }
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(error instanceof Error ? error.message : 'Сетевая ошибка');
  } finally {
    window.clearTimeout(timer);
  }
}

export async function fetchServerStatus(): Promise<ServerStatus> {
  const data = await request<unknown>('/api/server/status');
  if (!data || typeof data !== 'object') throw new ApiError('Некорректный статус сервера');
  const value = data as Record<string, unknown>;
  if (typeof value.online !== 'boolean' || typeof value.players !== 'number' || typeof value.maxPlayers !== 'number') {
    throw new ApiError('Некорректная структура статуса');
  }
  return {
    online: value.online,
    players: Math.max(0, value.players),
    maxPlayers: Math.max(0, value.maxPlayers),
    latencyMs: typeof value.latencyMs === 'number' ? value.latencyMs : undefined,
    version: typeof value.version === 'string' ? value.version : undefined,
  };
}

export async function fetchNews(): Promise<NewsItem[]> {
  const data = await request<unknown>('/api/news');
  if (!Array.isArray(data)) throw new ApiError('Некорректная структура новостей');
  return data.flatMap((item) => {
    if (!item || typeof item !== 'object') return [];
    const value = item as Record<string, unknown>;
    if (typeof value.title !== 'string' || typeof value.summary !== 'string') return [];
    return [{
      id: typeof value.id === 'number' || typeof value.id === 'string' ? value.id : crypto.randomUUID(),
      title: value.title,
      summary: value.summary,
      publishedAt: typeof value.date === 'string' ? value.date : new Date().toISOString().slice(0, 10),
      url: typeof value.url === 'string' ? value.url : undefined,
    }];
  });
}
