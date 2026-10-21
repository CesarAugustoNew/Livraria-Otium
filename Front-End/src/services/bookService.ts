import type { BookDetail, BookQuery, BookSummary, PageResponse } from '../types';
import { api } from './api';

export const bookService = {
  search(query: BookQuery = {}, signal?: AbortSignal): Promise<PageResponse<BookSummary>> {
    return api<PageResponse<BookSummary>>('/books', { query: { ...query }, signal });
  },
  get(id: string, signal?: AbortSignal): Promise<BookDetail> {
    return api<BookDetail>(`/books/${id}`, { signal });
  },
};
