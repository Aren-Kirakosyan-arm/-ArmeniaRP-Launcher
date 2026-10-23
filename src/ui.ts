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
  const latencyCopy = document.querySelector<HTMLElement>('#latency-copy');
  if (!badge || !players || !latency) return;

  if (!status) {
    badge.textContent = 'Սերվերը անհասանելի է';
    badge.dataset.state = 'offline';
    players.textContent = '—';
    latency.textContent = '—';
    if (latencyCopy) latencyCopy.textContent = 'Կապ չկա';
    return;
  }

  badge.textContent = status.online ? 'Սերվերը առցանց է' : 'Սերվերը օֆլայն է';
  badge.dataset.state = status.online ? 'online' : 'offline';
  players.textContent = `${status.players} / ${status.maxPlayers}`;
  const ping = status.latencyMs == null ? '—' : `${status.latencyMs} ms`;
  latency.textContent = ping;
  if (latencyCopy) latencyCopy.textContent = ping;
}

export function renderNews(items: { title: string; summary: string; publishedAt: string }[]): void {
  const root = document.querySelector<HTMLElement>('#news-list');
  if (!root) return;
  root.innerHTML = '<div class="section-label"><span>NEWS</span><strong>Նորություններ</strong></div>';
  for (const [index, item] of items.slice(0, 3).entries()) {
    const article = document.createElement('article');
    article.innerHTML = `<div class="news-index">${String(index + 1).padStart(2, '0')}</div><div><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.summary)}</small></div>`;
    root.appendChild(article);
  }
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>\"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char] ?? char);
}
