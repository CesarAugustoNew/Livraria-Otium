import { MinusIcon, PlusIcon } from '../ui/Icons';

const MAX_QUANTITY = 10;

interface Props {
  quantity: number;
  onChange: (quantity: number) => void;
  label: string;
}

/**
 * Mostra duas marcações (select no mobile, stepper +/- no desktop) e alterna via CSS,
 * seguindo o mesmo padrão já usado no Header para nav--mobile/nav--desktop.
 */
export function QuantityControl({ quantity, onChange, label }: Props) {
  const options = Array.from({ length: MAX_QUANTITY }, (_, i) => i + 1);

  return (
    <>
      <label className="qty qty--select">
        <span className="sr-only">Quantidade de {label}</span>
        <select value={quantity} onChange={(e) => onChange(Number(e.target.value))}>
          {options.map((n) => (
            <option key={n} value={n}>
              {n} UN
            </option>
          ))}
        </select>
      </label>

      <div className="qty qty--stepper">
        <button
          type="button"
          onClick={() => onChange(quantity - 1)}
          disabled={quantity <= 1}
          aria-label={`Diminuir quantidade de ${label}`}
        >
          <MinusIcon width={16} height={16} />
        </button>
        <span aria-live="polite">{quantity}</span>
        <button
          type="button"
          onClick={() => onChange(quantity + 1)}
          disabled={quantity >= MAX_QUANTITY}
          aria-label={`Aumentar quantidade de ${label}`}
        >
          <PlusIcon width={16} height={16} />
        </button>
      </div>
    </>
  );
}
