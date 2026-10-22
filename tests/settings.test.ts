import { describe, expect, it } from 'vitest';
import { validateNickname } from '../src/ui';

describe('settings validation', () => {
  it('rejects empty nickname before persistence', () => {
    expect(validateNickname('')).toBeNull();
  });

  it('accepts a normal nickname', () => {
    expect(validateNickname('Aren_19')).toBe('Aren_19');
  });
});
