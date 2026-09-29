import { bookService } from '../../services/bookService';
import { useAsync } from '../../hooks/useAsync';
import type { BookQuery } from '../../types';
import { EmptyState } from '../ui/EmptyState';
import { ErrorState } from '../ui/ErrorState';
import { SectionTitle } from '../ui/SectionTitle';
import { BookGrid } from './BookGrid';

interface Props {
  title: string;
  query: BookQuery;
  viewAllTo?: string;
}

/** Seção reutilizável da Home: novas seções (mais vendidos, ofertas…) são só novas instâncias com outra query. */
export function BookSection({ title, query, viewAllTo }: Props) {
  const { data, loading, error, reload } = useAsync(
    (signal) => bookService.search(query, signal),
    [JSON.stringify(query)],
  );

  return (
    <section className="section container">
      <SectionTitle title={title} viewAllTo={viewAllTo} />
      {error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : !loading && data?.content.length === 0 ? (
        <EmptyState title="Nada por aqui ainda" description="Volte em breve: novos livros chegam toda semana." />
      ) : (
        <BookGrid books={data?.content} loading={loading} skeletonCount={query.size ?? 4} />
      )}
    </section>
  );
}
