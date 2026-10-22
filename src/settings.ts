import { invoke } from '@tauri-apps/api/core';
import type { LauncherSettings } from './types';
import { validateNickname } from './ui';

const KEY = 'armeniarp.launcher.settings';

export function loadSettings(): LauncherSettings {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { nickname: '', executablePath: '' };
    const parsed = JSON.parse(raw) as Partial<LauncherSettings>;
    return {
      nickname: typeof parsed.nickname === 'string' ? parsed.nickname : '',
      executablePath: typeof parsed.executablePath === 'string' ? parsed.executablePath : '',
    };
  } catch {
    return { nickname: '', executablePath: '' };
  }
}

export function saveSettings(settings: LauncherSettings): void {
  const nickname = validateNickname(settings.nickname);
  if (!nickname) throw new Error('Никнейм должен содержать 3–24 символа: буквы, цифры, _ или -.');
  const executablePath = settings.executablePath.trim();
  if (!executablePath) throw new Error('Укажите путь к игровому .exe файлу.');
  localStorage.setItem(KEY, JSON.stringify({ nickname, executablePath }));
}

export async function launchGame(settings: LauncherSettings): Promise<void> {
  saveSettings(settings);
  const saved = loadSettings();
  await invoke('launch_game', { executablePath: saved.executablePath, nickname: saved.nickname });
}
