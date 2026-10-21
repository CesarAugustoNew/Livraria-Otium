import { useAsync } from '../../hooks/useAsync';
import { authorService } from '../../services/authorService';
import { categoryService } from '../../services/categoryService';
import { FilterSection } from './FilterSection';

export interface FilterSelection {
  categoryIds: string[];
  authorIds: string[];
}

interface Props {
  selection: FilterSelection;
  onChange: (next: FilterSelection) => void;
}

const EMPTY: FilterSelection = { categoryIds: [], authorIds: [] };

/** Os dois sistemas de filtro do catálogo: este (Assunto/Autores) e o SortMenu (Relevância). */
export function FilterSidebar({ selection, onChange }: Props) {
  const { data: categories, loading: loadingCategories } = useAsync((s) => categoryService.list(s), []);
  const { data: authors, loading: loadingAuthors } = useAsync((s) => authorService.list(s), []);

  const totalSelected = selection.categoryIds.length + selection.authorIds.length;

  return (
    <aside className="filters" aria-label="Filtros">
      <div className="filters__head">
        <h2>Filtros</h2>
        {totalSelected > 0 && (
          <button type="button" className="filters__clear" onClick={() => onChange(EMPTY)}>
            Limpar
          </button>
        )}
      </div>

      <FilterSection
        title="Assunto"
        options={categories ?? []}
        loading={loadingCategories}
        selected={selection.categoryIds}
        onChange={(categoryIds) => onChange({ ...selection, categoryIds })}
      />
      <FilterSection
        title="Autores"
        options={authors ?? []}
        loading={loadingAuthors}
        selected={selection.authorIds}
        onChange={(authorIds) => onChange({ ...selection, authorIds })}
        defaultOpen={false}
      />
    </aside>
  );
}
