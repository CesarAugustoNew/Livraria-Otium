import type { BookQuery, BookSort } from '../types';

const splitParam = (value: string | null): string[] => (value ? value.split(',').filter(Boolean) : []);

/**
 * Converte os parâmetros da URL do catálogo (/livros?q=&categoria=&autor=&lancamentos=&sort=&page=) na consulta
 * da API. Usado pela página do catálogo e pelos banners, que mostram uma prévia do que o link abre.
 */
export function catalogQueryFromParams(params: URLSearchParams): BookQuery {
  return {
    title: params.get('q') ?? undefined,
    categoryIds: splitParam(params.get('categoria')),
    authorIds: splitParam(params.get('autor')),
    release: params.get('lancamentos') === 'true' ? true : undefined,
    page: Math.max(0, Number(params.get('page') ?? 0) || 0),
    sort: (params.get('sort') as BookSort) || 'relevance',
  };
}
