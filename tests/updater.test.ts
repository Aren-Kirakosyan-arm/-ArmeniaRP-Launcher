import { describe, expect, it } from 'vitest';
import { compareVersions, validateManifest } from '../src/updater';

describe('compareVersions', () => {
  it('orders semantic versions', () => {
    expect(compareVersions('0.1.0', '0.2.0')).toBe(-1);
    expect(compareVersions('1.0.0', '1.0.0')).toBe(0);
    expect(compareVersions('2.0.0', '1.9.9')).toBe(1);
  });
});

describe('validateManifest', () => {
  it('rejects incomplete manifests', () => {
    expect(() => validateManifest({ version: '1.0.0' })).toThrow();
  });
});
