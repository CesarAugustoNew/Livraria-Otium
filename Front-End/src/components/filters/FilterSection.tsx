import { useId, useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '../ui/Icons';

interface Option {
  id: string;
  name: string;
}

interface Props {
  title: string;
  options: Option[];
  selected: string[];
  onChange: (next: string[]) => void;
  defaultOpen?: boolean;
  loading?: boolean;
}

/** Uma seção "Assunto"/"Autores" do filtro lateral: título clicável + lista de checkboxes com rolagem. */
export function FilterSection({ title, options, selected, onChange, defaultOpen = true, loading }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();

  function toggle(id: string) {
    onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);
  }

  return (
    <div className="filter-section">
      <button
        type="button"
        className="filter-section__head"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
      >
        <span>
          {title}
          {selected.length > 0 && <span className="filter-section__count">{selected.length}</span>}
        </span>
        {open ? <ChevronUpIcon width={18} height={18} /> : <ChevronDownIcon width={18} height={18} />}
      </button>

      {open && (
        <div id={panelId} className="filter-section__panel">
          {loading ? (
            <p className="filter-section__hint">Carregando…</p>
          ) : options.length === 0 ? (
            <p className="filter-section__hint">Nenhuma opção disponível.</p>
          ) : (
            <ul className="filter-section__list">
              {options.map((opt) => (
                <li key={opt.id}>
                  <label className="checkbox">
                    <input type="checkbox" checked={selected.includes(opt.id)} onChange={() => toggle(opt.id)} />
                    <span className="checkbox__box" aria-hidden="true" />
                    <span className="checkbox__label">{opt.name}</span>
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
