import { describe, expect, it } from 'vitest';
import { validateNickname } from '../src/ui';

describe('validateNickname', () => {
  it('normalizes a valid nickname', () => expect(validateNickname('  Aren_19 ')).toBe('Aren_19'));
  it('rejects whitespace', () => expect(validateNickname('   ')).toBeNull());
  it('rejects invalid characters', () => expect(validateNickname('Aren 19')).toBeNull());
  it('rejects too-short nicknames', () => expect(validateNickname('Ar')).toBeNull());
});
