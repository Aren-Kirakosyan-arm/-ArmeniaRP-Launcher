import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, test } from 'vitest';

const indexPath = path.resolve(process.cwd(), 'src/index.html');
const cssPath = path.resolve(process.cwd(), 'src/styles-elite-reference.css');
const html = fs.readFileSync(indexPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');

describe('Elite RP reference launcher contract', () => {
  test('uses a single-screen Elite RP shell', () => {
    expect(html).toContain('class="elite-launcher"');
    expect(html).toContain('ELITE RP');
    expect(html).not.toContain('ArmeniaRP Launcher');
  });
  test('contains custom desktop title controls and profile', () => {
    expect(html).toContain('class="window-controls"');
    expect(html).toContain('class="profile-chip"');
  });
  test('contains the primary play action and server information', () => {
    expect(html).toContain('class="play-button"');
    expect(html).toContain('ԽԱՂԱԼ');
    expect(html).toContain('class="server-card"');
    expect(html).toContain('Սերվերը առցանց է');
  });
  test('contains compact news and update sections', () => {
    expect(html).toContain('class="news-strip"');
    expect(html).toContain('class="update-card"');
    expect(html).toContain('Նորություններ');
  });
  test('prevents browser-like visible scrolling', () => {
    expect(css).toMatch(/html\s*,\s*body[^}]*overflow:\s*hidden/i);
    expect(css).toMatch(/\.elite-launcher[^}]*overflow:\s*hidden/i);
  });
});
