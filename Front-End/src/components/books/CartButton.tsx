import { BagIcon } from '../ui/Icons';

interface Props {
  disabled?: boolean;
  onAdd: () => void;
  bookTitle: string;
}

export function CartButton({ disabled, onAdd, bookTitle }: Props) {
  return (
    <button
      type="button"
      className="btn btn--primary btn--block btn--icon"
      onClick={onAdd}
      disabled={disabled}
      aria-label={disabled ? `${bookTitle} indisponível` : `Adicionar ${bookTitle} ao carrinho`}
    >
      {!disabled && <BagIcon width={18} height={18} />}
      {disabled ? 'Indisponível' : 'Adicionar ao carrinho'}
    </button>
  );
}
