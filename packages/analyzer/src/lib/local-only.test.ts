import { describe, it, expect } from 'vitest';
import { localOnlyFromEnv } from './local-only.js';

describe('localOnlyFromEnv', () => {
  it('is on only for the exact string "true"', () => {
    expect(localOnlyFromEnv({ VITE_LOCAL_ONLY: 'true' })).toBe(true);
  });

  it.each([undefined, '', '1', 'TRUE', 'yes', 'false'])('stays gated for %s', (value) => {
    expect(localOnlyFromEnv({ VITE_LOCAL_ONLY: value })).toBe(false);
  });

  it('stays gated when the variable is absent', () => {
    expect(localOnlyFromEnv({})).toBe(false);
  });
});
