import type { Category } from '../types';
import { api } from './api';

export const categoryService = {
  list: (signal?: AbortSignal) => api<Category[]>('/categories', { signal }),
};
