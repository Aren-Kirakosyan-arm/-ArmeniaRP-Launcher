export interface ServerStatus {
  online: boolean;
  players: number;
  maxPlayers: number;
  latencyMs?: number;
  version?: string;
}

export interface NewsItem {
  id: number | string;
  title: string;
  summary: string;
  publishedAt: string;
  imageUrl?: string;
  url?: string;
}

export interface LauncherSettings {
  nickname: string;
  executablePath: string;
}
