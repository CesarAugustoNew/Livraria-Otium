// Espelham os DTOs do backend (Back-End/src/main/java/com/otium/livraria/dto)

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface BookSummary {
  id: string;
  title: string;
  slug: string;
  coverUrl: string | null;
  price: number;
  originalPrice: number | null;
  discountPercent: number;
  available: boolean;
  release: boolean;
  authors: string[];
  averageRating: number;
  reviewCount: number;
  /** Somente nos mocks, para os filtros funcionarem sem backend. */
  categoryId?: string;
  authorIds?: string[];
  collectionId?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Author {
  id: string;
  name: string;
  slug: string;
}

export interface BookCollection {
  id: string;
  name: string;
  slug: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  imageUrl: string | null;
  linkUrl: string | null;
}

export type BookSort =
  | 'relevance'
  | 'best_sellers'
  | 'newest'
  | 'discount'
  | 'price_desc'
  | 'price_asc'
  | 'title_asc'
  | 'title_desc';

export interface BookQuery {
  title?: string;
  categoryIds?: string[];
  authorIds?: string[];
  collectionIds?: string[];
  release?: boolean;
  available?: boolean;
  page?: number;
  size?: number;
  sort?: BookSort;
}

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  expiresInSeconds: number;
  user: UserInfo;
}
