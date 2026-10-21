import type { Author } from '../types';
import { api } from './api';

export const authorService = {
  list: (signal?: AbortSignal) => api<Author[]>('/authors', { signal }),
};
