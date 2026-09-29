import { StarIcon } from '../ui/Icons';

interface Props {
  active: boolean;
  onToggle: () => void;
  bookTitle: string;
}

export function FavoriteButton({ active, onToggle, bookTitle }: Props) {
  return (
    <button
      type="button"
      className={`icon-btn favorite-btn${active ? ' is-active' : ''}`}
      onClick={onToggle}
      aria-pressed={active}
      aria-label={active ? `Remover ${bookTitle} dos favoritos` : `Favoritar ${bookTitle}`}
    >
      <StarIcon filled={active} />
    </button>
  );
}
