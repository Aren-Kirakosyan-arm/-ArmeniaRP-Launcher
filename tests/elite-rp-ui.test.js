import fs from 'node:fs';
import path from 'node:path';
import { describe, test, expect } from 'vitest';

describe('Elite RP launcher UI', () => {
  const root = path.resolve(__dirname, '..');
  const html = fs.readFileSync(path.join(root, 'src', 'index.html'), 'utf8');
  const css = fs.readFileSync(path.join(root, 'src', 'styles-elite-rp.css'), 'utf8');

  test('uses Elite RP branding and Armenian play action', () => {
    expect(html).toContain('ELITE RP');
    expect(html).toContain('ԽԱՂԱԼ');
  });

  test('does not expose a page scrollbar and uses a desktop launcher shell', () => {
    expect(css).toMatch(/overflow:\s*hidden/);
    expect(css).toMatch(/border-radius:\s*2[0-9]px/);
  });
});
