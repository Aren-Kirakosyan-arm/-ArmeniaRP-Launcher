import type { ServerStatus } from './types';

export function validateNickname(value: string): string | null {
  const nickname = value.trim();
  if (!nickname || nickname.length < 3 || nickname.length > 24) return null;
  if (!/^[\p{L}\p{N}_-]+$/u.test(nickname)) return null;
  return nickname;
}

export function renderServerStatus(status: ServerStatus | null): void {
  const badge = document.querySelector<HTMLElement>('#server-status');
  const players = document.querySelector<HTMLElement>('#player-count');
  const latency = document.querySelector<HTMLElement>('#latency');
  if (!badge || !players || !latency) return;

  if (!status) {
    badge.textContent = 'UNAVAILABLE';
    badge.dataset.state = 'offline';
    players.textContent = '—';
    latency.textContent = 'Нет соединения';
    return;
  }

  badge.textContent = status.online ? 'ONLINE' : 'OFFLINE';
  badge.dataset.state = status.online ? 'online' : 'offline';
  players.textContent = `${status.players} / ${status.maxPlayers}`;
  latency.textContent = status.latencyMs == null ? '—' : `${status.latencyMs} ms`;
}

export function renderNews(items: { title: string; summary: string; publishedAt: string }[]): void {
  const root = document.querySelector<HTMLElement>('#news-list');
  if (!root) return;
  root.innerHTML = '';
  for (const item of items) {
    const article = document.createElement('article');
    article.className = 'news-card';
    article.innerHTML = `<span>${escapeHtml(item.publishedAt)}</span><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.summary)}</p>`;
    root.appendChild(article);
  }
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>\"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char] ?? char);
}
