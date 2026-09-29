import type { BookSummary } from '../../types';
import { BookCardSkeleton } from '../ui/Skeleton';
import { BookCard } from './BookCard';

interface Props {
  books?: BookSummary[];
  loading?: boolean;
  /** true = grid quebra em linhas em todas as telas; false = carrossel horizontal no mobile */
  wrap?: boolean;
  skeletonCount?: number;
}

export function BookGrid({ books, loading, wrap = false, skeletonCount = 4 }: Props) {
  const cls = `book-grid${wrap ? ' book-grid--wrap' : ''}`;

  if (loading) {
    return (
      <div className={cls} aria-busy="true" aria-label="Carregando livros">
        {Array.from({ length: skeletonCount }, (_, i) => (
          <BookCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <ul className={cls}>
      {books?.map((book) => (
        <li key={book.id}>
          <BookCard book={book} />
        </li>
      ))}
    </ul>
  );
}
