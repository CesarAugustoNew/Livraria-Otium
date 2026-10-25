import { Link } from 'react-router-dom';
import { EmptyState } from '../components/ui/EmptyState';

export function NotFound() {
  return (
    <div className="container section">
      <EmptyState
        title="Página não encontrada"
        description="O endereço não existe ou foi movido."
        action={<Link to="/" className="btn btn--primary">Voltar à página inicial</Link>}
      />
    </div>
  );
}
