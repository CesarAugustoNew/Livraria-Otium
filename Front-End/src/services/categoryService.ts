import { mockCategories } from '../mocks/data';
import type { Category } from '../types';
import { api, USE_MOCKS } from './api';

export const categoryService = {
  async list(signal?: AbortSignal): Promise<Category[]> {
    if (USE_MOCKS) return mockCategories;
    return api<Category[]>('/categories', { signal });
  },
};
