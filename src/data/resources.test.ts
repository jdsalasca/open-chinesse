import { describe, expect, it } from 'vitest';
import { CHARACTER_VIDEOS, RESOURCES } from './resources';

const ALL = [...RESOURCES, ...CHARACTER_VIDEOS];

describe('recursos de inmersión', () => {
  it('tiene una colección amplia y cubre los tres niveles', () => {
    expect(RESOURCES.length).toBeGreaterThanOrEqual(18);
    for (const level of [1, 2, 3] as const) {
      expect(
        RESOURCES.some((resource) => resource.level === level),
        `HSK ${level}`,
      ).toBe(true);
    }
  });

  it('no repite ids y todos los enlaces son de YouTube', () => {
    expect(new Set(ALL.map((resource) => resource.id)).size).toBe(ALL.length);
    for (const resource of ALL) {
      expect(resource.url, resource.id).toMatch(/^https:\/\/www\.youtube\.com\/watch\?v=/);
      expect(resource.minutes, resource.id).toBeGreaterThan(0);
      expect(resource.title.trim(), resource.id).not.toBe('');
      expect(resource.why.trim(), resource.id).not.toBe('');
    }
  });

  it('separa los vídeos de historia de los caracteres', () => {
    expect(CHARACTER_VIDEOS.length).toBeGreaterThanOrEqual(4);
    expect(CHARACTER_VIDEOS.every((video) => video.topic === 'caracteres')).toBe(true);
    expect(RESOURCES.every((video) => video.topic !== 'caracteres')).toBe(true);
  });
});
