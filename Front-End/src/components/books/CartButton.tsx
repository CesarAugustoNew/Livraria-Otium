<<<<<<< HEAD
import { BagIcon } from '../ui/Icons';

=======
>>>>>>> eef4721feea8c8fd2831a9eb36cc6284c65b2096
interface Props {
  disabled?: boolean;
  onAdd: () => void;
  bookTitle: string;
}

export function CartButton({ disabled, onAdd, bookTitle }: Props) {
  return (
    <button
      type="button"
<<<<<<< HEAD
      className="btn btn--primary btn--block btn--icon"
=======
      className="btn btn--primary btn--block"
>>>>>>> eef4721feea8c8fd2831a9eb36cc6284c65b2096
      onClick={onAdd}
      disabled={disabled}
      aria-label={disabled ? `${bookTitle} indisponível` : `Adicionar ${bookTitle} ao carrinho`}
    >
<<<<<<< HEAD
      {!disabled && <BagIcon width={18} height={18} />}
=======
>>>>>>> eef4721feea8c8fd2831a9eb36cc6284c65b2096
      {disabled ? 'Indisponível' : 'Adicionar ao carrinho'}
    </button>
  );
}
