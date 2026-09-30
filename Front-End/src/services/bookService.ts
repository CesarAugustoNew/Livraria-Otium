<<<<<<< HEAD
import { mockBookDetails, mockBooks } from '../mocks/data';
import type { BookDetail, BookQuery, BookSummary, PageResponse } from '../types';
import { ApiError, api, USE_MOCKS } from './api';
=======
import { mockBooks } from '../mocks/data';
import type { BookQuery, BookSummary, PageResponse } from '../types';
import { api, USE_MOCKS } from './api';
>>>>>>> eef4721feea8c8fd2831a9eb36cc6284c65b2096

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

<<<<<<< HEAD
async function getMock(id: string): Promise<BookDetail> {
  await delay();
  const found = mockBookDetails[id];
  if (!found) throw new ApiError(404, 'ResourceNotFound', 'Livro não encontrado.');
  return found;
}

=======
>>>>>>> eef4721feea8c8fd2831a9eb36cc6284c65b2096
export const bookService = {
  search(query: BookQuery = {}, signal?: AbortSignal): Promise<PageResponse<BookSummary>> {
    if (USE_MOCKS) return searchMock(query);
    return api<PageResponse<BookSummary>>('/books', { query: { ...query }, signal });
  },
<<<<<<< HEAD
  get(id: string, signal?: AbortSignal): Promise<BookDetail> {
    if (USE_MOCKS) return getMock(id);
    return api<BookDetail>(`/books/${id}`, { signal });
  },
=======
>>>>>>> eef4721feea8c8fd2831a9eb36cc6284c65b2096
};
