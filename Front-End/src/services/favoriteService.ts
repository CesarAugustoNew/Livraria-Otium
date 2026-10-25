import type { BookSummary } from '../types';
import { api } from './api';

/** Favoritos ficam na conta: todas as rotas exigem login. */
export const favoriteService = {
  list: (signal?: AbortSignal) => api<BookSummary[]>('/favorites', { signal }),
  add: (bookId: string) => api<void>(`/favorites/${bookId}`, { method: 'PUT' }),
  remove: (bookId: string) => api<void>(`/favorites/${bookId}`, { method: 'DELETE' }),
};
