import { launcherConfig } from './config';
import { fetchNews, fetchServerStatus } from './api';
import { launchGame, loadSettings, saveSettings } from './settings';
import { renderNews, renderServerStatus, validateNickname } from './ui';

const fallbackNews = [
  { id: 1, title: 'ArmeniaRP Launcher', summary: 'Բարի գալուստ ArmeniaRP-ի պաշտոնական launcher։ Պատրաստվեք նոր արկածների։', publishedAt: '22.10.2026' },
  { id: 2, title: 'Սերվերի միացում', summary: 'Մուտքագրեք Ձեր մականունը, ընտրեք խաղի ճանապարհը և սեղմեք «ԽԱՂԱԼ»։', publishedAt: '22.10.2026' },
  { id: 3, title: 'Նոր թարմացումներ', summary: 'Ավտոմատ թարմացման համակարգը պատրաստվում է և շուտով հասանելի կլինի։', publishedAt: '22.10.2026' },
];

const nicknameInput = document.querySelector<HTMLInputElement>('#nickname')!;
const settingsDialog = document.querySelector<HTMLDialogElement>('#settings-dialog')!;
const settingsNickname = document.querySelector<HTMLInputElement>('#settings-nickname')!;
const gamePath = document.querySelector<HTMLInputElement>('#game-path')!;
const message = document.querySelector<HTMLElement>('#message')!;

function setMessage(text: string, error = false) {
  message.textContent = text;
  message.style.color = error ? '#f29aa0' : '';
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
    // Տեղային նորությունները պահպանում են launcher-ի աշխատանքը API-ի անհասանելիության դեպքում։
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
  if (!nickname) return setMessage('Մուտքագրեք ճիշտ մականուն՝ առնվազն 3 նիշ։', true);
  const current = loadSettings();
  if (!current.executablePath) {
    setMessage('Սկզբում նշեք խաղի .exe ֆայլի ճանապարհը կարգավորումներում։', true);
    settingsDialog.showModal();
    return;
  }
  try {
    await launchGame({ nickname, executablePath: current.executablePath });
    setMessage('Խաղը գործարկված է։ Հաճելի խաղ։');
  } catch (error) {
    setMessage(error instanceof Error ? error.message : 'Չհաջողվեց գործարկել խաղը։', true);
  }
});

document.querySelector('#settings-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  try {
    saveSettings({ nickname: settingsNickname.value, executablePath: gamePath.value });
    nicknameInput.value = loadSettings().nickname;
    settingsDialog.close();
    setMessage('Կարգավորումները պահպանված են։');
  } catch (error) {
    setMessage(error instanceof Error ? error.message : 'Կարգավորումների պահպանման սխալ։', true);
  }
});

void refresh();
