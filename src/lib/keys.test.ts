import { describe, expect, it } from 'vitest';
import { withKeys } from './keys';

describe('withKeys', () => {
  it('distingue repeticiones del mismo texto', () => {
    const keys = withKeys(['ma', 'ma', 'hao'], (item) => item).map((entry) => entry.key);
    expect(keys).toEqual(['ma#0', 'ma#1', 'hao#0']);
    expect(new Set(keys).size).toBe(3);
  });

  it('mantiene el orden de los elementos', () => {
    const items = withKeys([3, 1, 2], (item) => String(item));
    expect(items.map((entry) => entry.item)).toEqual([3, 1, 2]);
  });
});
