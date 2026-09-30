import { mockCollections } from '../mocks/data';
import type { BookCollection } from '../types';
import { api, USE_MOCKS } from './api';

export const collectionService = {
  async list(signal?: AbortSignal): Promise<BookCollection[]> {
    if (USE_MOCKS) return mockCollections;
    return api<BookCollection[]>('/collections', { signal });
  },
};
