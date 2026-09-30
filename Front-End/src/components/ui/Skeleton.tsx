export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`} aria-hidden="true" />;
}

export function BookCardSkeleton() {
  return (
    <div className="book-card book-card--skeleton" aria-hidden="true">
      <Skeleton className="skeleton--cover" />
      <Skeleton className="skeleton--line" />
      <Skeleton className="skeleton--line skeleton--short" />
      <Skeleton className="skeleton--line skeleton--price" />
    </div>
  );
}
