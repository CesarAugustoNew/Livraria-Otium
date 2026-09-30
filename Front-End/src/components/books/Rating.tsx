import { StarIcon } from '../ui/Icons';

export function Rating({ value, count }: { value: number; count: number }) {
  if (count === 0) return <div className="rating rating--empty">Sem avaliações</div>;
  return (
    <div className="rating" role="img" aria-label={`Nota ${value} de 5, ${count} avaliações`}>
      <StarIcon filled width={16} height={16} />
      <strong>{value.toFixed(1)}</strong>
      <span>({count})</span>
    </div>
  );
}
