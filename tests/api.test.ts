import { describe, expect, it } from 'vitest';
import { ApiError } from '../src/api';

describe('ApiError', () => {
  it('is a normalized API error', () => {
    const error = new ApiError('offline');
    expect(error.name).toBe('ApiError');
    expect(error.message).toBe('offline');
  });
});
