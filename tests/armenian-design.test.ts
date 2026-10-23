import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Elite RP launcher design', () => {
  const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');
  const css = readFileSync(resolve(process.cwd(), 'src/styles.css'), 'utf8');

  it('uses Armenian primary UI copy and Elite RP branding', () => {
    expect(html).toContain('ԽԱՂԱԼ');
    expect(html).toContain('Մուտքագրեք Ձեր մականունը');
    expect(html).toContain('Կարգավորումներ');
    expect(html).toContain('Նորություններ');
    expect(html).toContain('ELITE RP');
  });

  it('contains Armenian visual identity and responsive premium styling', () => {
    expect(css).toContain('#d90012');
    expect(css).toContain('#0033a0');
    expect(css).toContain('#f2a800');
    expect(css).toContain('@media');
    expect(css).toContain('backdrop-filter');
  });
});
