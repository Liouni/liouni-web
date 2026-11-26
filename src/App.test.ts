import { describe, expect, it } from 'bun:test';
import { buildApiUrl } from './App';

describe('buildApiUrl', () => {
  it('uses relative path when base URL is empty (nginx /api proxy)', () => {
    expect(buildApiUrl('/api/health', '')).toBe('/api/health');
  });

  it('joins explicit base URL without double slashes', () => {
    expect(buildApiUrl('/api/health', 'https://api.example.com/')).toBe('https://api.example.com/api/health');
  });
});
