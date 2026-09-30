interface Props {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: Props) {
  return (
    <div className="state state--error" role="alert">
      <h3>Não foi possível carregar</h3>
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="btn btn--outline" onClick={onRetry}>
          Tentar novamente
        </button>
      )}
    </div>
  );
}
