import { useEffect, useRef, useState } from 'react';
import type { BookSort } from '../../types';
import { CheckIcon, ChevronDownIcon } from '../ui/Icons';

const OPTIONS: { value: BookSort; label: string }[] = [
  { value: 'relevance', label: 'Relevância' },
  { value: 'best_sellers', label: 'Mais vendidos' },
  { value: 'newest', label: 'Mais recentes' },
  { value: 'discount', label: 'Desconto' },
  { value: 'price_desc', label: 'Preço: do maior para o menor' },
  { value: 'price_asc', label: 'Preço: do menor para o maior' },
  { value: 'title_asc', label: 'Nome em ordem crescente' },
  { value: 'title_desc', label: 'Nome em ordem decrescente' },
];

interface Props {
  value: BookSort;
  onChange: (value: BookSort) => void;
}

/** Segundo sistema de filtro do catálogo: ordenação por relevância, vendas, preço, desconto ou nome. */
export function SortMenu({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = OPTIONS.find((o) => o.value === value) ?? OPTIONS[0];

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  return (
    <div className="sort-menu" ref={ref}>
      <button
        type="button"
        className="sort-menu__trigger"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="sort-menu__label">Relevância:</span> {current.label}
        <ChevronDownIcon width={18} height={18} />
      </button>

      {open && (
        <ul className="sort-menu__panel" role="listbox">
          {OPTIONS.map((opt) => (
            <li key={opt.value}>
              <button
                type="button"
                role="option"
                aria-selected={opt.value === value}
                className="sort-menu__option"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
              >
                {opt.label}
                {opt.value === value && <CheckIcon width={16} height={16} />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
