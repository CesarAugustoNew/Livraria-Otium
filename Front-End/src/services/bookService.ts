import { mockBooks } from '../mocks/data';
import type { BookQuery, BookSummary, PageResponse } from '../types';
import { api, USE_MOCKS } from './api';

const delay = (ms = 350) => new Promise((r) => setTimeout(r, ms));

function matchesAny(value: string | undefined, ids: string[] | undefined): boolean {
  return !ids || ids.length === 0 || (value !== undefined && ids.includes(value));
}

async function searchMock(q: BookQuery): Promise<PageResponse<BookSummary>> {
  await delay();
  let items = mockBooks.filter(
    (b) =>
      (!q.title || b.title.toLowerCase().includes(q.title.toLowerCase())) &&
      matchesAny(b.categoryId, q.categoryIds) &&
      matchesAny(b.collectionId, q.collectionIds) &&
      (!q.authorIds?.length || b.authorIds?.some((id) => q.authorIds!.includes(id))) &&
      (q.release === undefined || b.release === q.release) &&
      (!q.available || b.available),
  );

  switch (q.sort) {
    case 'price_asc':
      items = [...items].sort((a, b) => a.price - b.price);
      break;
    case 'price_desc':
      items = [...items].sort((a, b) => b.price - a.price);
      break;
    case 'title_asc':
      items = [...items].sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'title_desc':
      items = [...items].sort((a, b) => b.title.localeCompare(a.title));
      break;
    case 'discount':
      items = [...items].sort((a, b) => b.discountPercent - a.discountPercent);
      break;
    case 'best_sellers':
      items = [...items].sort((a, b) => b.reviewCount - a.reviewCount);
      break;
    default:
      break; // 'relevance' e 'newest' mantêm a ordem de cadastro nos mocks
  }

  const size = q.size ?? 12;
  const page = q.page ?? 0;
  return {
    content: items.slice(page * size, page * size + size),
    page,
    size,
    totalElements: items.length,
    totalPages: Math.max(1, Math.ceil(items.length / size)),
  };
}

export const bookService = {
  search(query: BookQuery = {}, signal?: AbortSignal): Promise<PageResponse<BookSummary>> {
    if (USE_MOCKS) return searchMock(query);
    return api<PageResponse<BookSummary>>('/books', { query: { ...query }, signal });
  },
};
