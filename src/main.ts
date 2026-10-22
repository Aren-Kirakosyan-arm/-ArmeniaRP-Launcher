import { launcherConfig } from './config';
import { fetchNews, fetchServerStatus } from './api';
import { launchGame, loadSettings, saveSettings } from './settings';
import { renderNews, renderServerStatus, validateNickname } from './ui';

const fallbackNews = [
  { id: 1, title: 'ArmeniaRP Launcher', summary: 'Первая версия лаунчера готова к подключению к серверному API.', publishedAt: '2026-10-22' },
  { id: 2, title: 'Добро пожаловать', summary: 'Настрой никнейм и путь к игре в разделе настроек.', publishedAt: '2026-10-22' },
  { id: 3, title: 'Скоро обновления', summary: 'Фундамент автоматического updater уже заложен в проект.', publishedAt: '2026-10-22' },
];

const nicknameInput = document.querySelector<HTMLInputElement>('#nickname')!;
const settingsDialog = document.querySelector<HTMLDialogElement>('#settings-dialog')!;
const settingsNickname = document.querySelector<HTMLInputElement>('#settings-nickname')!;
const gamePath = document.querySelector<HTMLInputElement>('#game-path')!;
const message = document.querySelector<HTMLElement>('#message')!;

function setMessage(text: string, error = false) {
  message.textContent = text;
  message.style.color = error ? '#f28c91' : '';
}

async function refresh() {
  renderNews(fallbackNews);
  try {
    const status = await fetchServerStatus();
    renderServerStatus(status);
    if (status.version) document.title = `ArmeniaRP Launcher · ${status.version}`;
  } catch {
    renderServerStatus(null);
  }
  try {
    const news = await fetchNews();
    if (news.length) renderNews(news);
  } catch {
    // Local fallback keeps the launcher usable when the API is unavailable.
  }
}

const settings = loadSettings();
nicknameInput.value = settings.nickname;

(document.querySelector('#server-address') as HTMLElement).textContent = `${launcherConfig.server.host}:${launcherConfig.server.port}`;
(document.querySelector('#settings-button') as HTMLButtonElement).addEventListener('click', () => {
  settingsNickname.value = nicknameInput.value;
  gamePath.value = loadSettings().executablePath;
  settingsDialog.showModal();
});

document.querySelector('#refresh-button')?.addEventListener('click', () => void refresh());

document.querySelector('#play-button')?.addEventListener('click', async () => {
  const nickname = validateNickname(nicknameInput.value);
  if (!nickname) return setMessage('Введите корректный никнейм.', true);
  const current = loadSettings();
  if (!current.executablePath) {
    setMessage('Сначала укажите путь к игре в настройках.', true);
    settingsDialog.showModal();
    return;
  }
  try {
    await launchGame({ nickname, executablePath: current.executablePath });
    setMessage('Игра запущена. Удачной игры!');
  } catch (error) {
    setMessage(error instanceof Error ? error.message : 'Не удалось запустить игру.', true);
  }
});

document.querySelector('#settings-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  try {
    saveSettings({ nickname: settingsNickname.value, executablePath: gamePath.value });
    nicknameInput.value = loadSettings().nickname;
    settingsDialog.close();
    setMessage('Настройки сохранены.');
  } catch (error) {
    setMessage(error instanceof Error ? error.message : 'Ошибка настроек.', true);
  }
});

void refresh();
