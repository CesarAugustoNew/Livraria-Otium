import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BookGrid } from '../components/books/BookGrid';
import { FilterSidebar, type FilterSelection } from '../components/filters/FilterSidebar';
import { SortMenu } from '../components/filters/SortMenu';
import { CloseIcon, FilterIcon } from '../components/ui/Icons';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';
import { useAsync } from '../hooks/useAsync';
import { bookService } from '../services/bookService';
import type { BookQuery, BookSort } from '../types';

const PAGE_SIZE = 12;
const splitParam = (value: string | null): string[] => (value ? value.split(',').filter(Boolean) : []);

export function Catalog() {
  const [params, setParams] = useSearchParams();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const q = params.get('q') ?? undefined;
  const page = Math.max(0, Number(params.get('page') ?? 0) || 0);
  const sort = (params.get('sort') as BookSort) || 'relevance';
  const selection: FilterSelection = {
    categoryIds: splitParam(params.get('categoria')),
    authorIds: splitParam(params.get('autor')),
    collectionIds: splitParam(params.get('colecao')),
  };

  const query: BookQuery = {
    title: q,
    categoryIds: selection.categoryIds,
    authorIds: selection.authorIds,
    collectionIds: selection.collectionIds,
    release: params.get('lancamentos') === 'true' ? true : undefined,
    page,
    size: PAGE_SIZE,
    sort,
  };

  const { data, loading, error, reload } = useAsync(
    (signal) => bookService.search(query, signal),
    [JSON.stringify(query)],
  );

  function update(next: Record<string, string | undefined>) {
    const copy = new URLSearchParams(params);
    Object.entries(next).forEach(([k, v]) => (v ? copy.set(k, v) : copy.delete(k)));
    setParams(copy);
  }

  function updateSelection(next: FilterSelection) {
    update({
      categoria: next.categoryIds.join(',') || undefined,
      autor: next.authorIds.join(',') || undefined,
      colecao: next.collectionIds.join(',') || undefined,
      page: undefined,
    });
  }

  const title = q ? `Resultados para “${q}”` : params.get('lancamentos') ? 'Lançamentos' : 'Todos os livros';
  const activeFilterCount = selection.categoryIds.length + selection.authorIds.length + selection.collectionIds.length;

  return (
    <div className="container section catalog">
      <button
        type="button"
        className="btn btn--outline catalog__filter-toggle"
        onClick={() => setDrawerOpen(true)}
      >
        <FilterIcon width={18} height={18} />
        Filtros
        {activeFilterCount > 0 && <span className="catalog__filter-count">{activeFilterCount}</span>}
      </button>

      <div className="catalog__layout">
        <div className="catalog__sidebar catalog__sidebar--desktop">
          <FilterSidebar selection={selection} onChange={updateSelection} />
        </div>

        {drawerOpen && (
          <div className="drawer" role="dialog" aria-modal="true" aria-label="Filtros">
            <div className="drawer__backdrop" onClick={() => setDrawerOpen(false)} />
            <div className="drawer__panel">
              <div className="drawer__head">
                <h2>Filtros</h2>
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Fechar filtros"
                >
                  <CloseIcon />
                </button>
              </div>
              <FilterSidebar selection={selection} onChange={updateSelection} />
              <button type="button" className="btn btn--primary btn--block" onClick={() => setDrawerOpen(false)}>
                Ver resultados
              </button>
            </div>
          </div>
        )}

        <div className="catalog__content">
          <div className="catalog__head">
            <h1>{title}</h1>
            <SortMenu value={sort} onChange={(value) => update({ sort: value, page: undefined })} />
          </div>

          {error ? (
            <ErrorState message={error} onRetry={reload} />
          ) : !loading && data?.content.length === 0 ? (
            <EmptyState title="Nenhum livro encontrado" description="Tente outro termo ou remova os filtros." />
          ) : (
            <BookGrid books={data?.content} loading={loading} wrap skeletonCount={8} />
          )}

          {data && data.totalPages > 1 && (
            <nav className="pagination" aria-label="Paginação">
              <button
                type="button"
                className="btn btn--outline"
                disabled={page === 0}
                onClick={() => update({ page: String(page - 1) })}
              >
                Anterior
              </button>
              <span>
                Página {page + 1} de {data.totalPages}
              </span>
              <button
                type="button"
                className="btn btn--outline"
                disabled={page + 1 >= data.totalPages}
                onClick={() => update({ page: String(page + 1) })}
              >
                Próxima
              </button>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}
