import { mockAuthors } from '../mocks/data';
import type { Author } from '../types';
import { api, USE_MOCKS } from './api';

export const authorService = {
  async list(signal?: AbortSignal): Promise<Author[]> {
    if (USE_MOCKS) return mockAuthors;
    return api<Author[]>('/authors', { signal });
  },
};
