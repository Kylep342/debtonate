import { describe, expect, it } from 'vitest';

import { generateId, resetIdCounter } from '@/apps/shared/functions/id';

describe('generateId utility', () => {
  it('generates unique string IDs', () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(typeof id1).toBe('string');
    expect(typeof id2).toBe('string');
    expect(id1).not.toBe(id2);
  });

  it('guarantees ID numeric value is well above 2^32 - 1 (non-32-bit array index)', () => {
    const MAX_UINT32 = 4294967295;
    for (let i = 0; i < 100; i++) {
      const id = generateId();
      expect(Number(id)).toBeGreaterThan(MAX_UINT32);
    }
  });

  it('maintains insertion order in Object.keys', () => {
    resetIdCounter();
    const ids = [generateId(), generateId(), generateId()];
    const obj: Record<string, number> = {};
    ids.forEach((id, idx) => {
      obj[id] = idx;
    });

    expect(Object.keys(obj)).toEqual(ids);
  });
});
