import { Link } from 'react-router-dom';
import { EmptyState } from '../components/ui/EmptyState';

/** Também usada como placeholder das rotas ainda não implementadas (entrar, carrinho, favoritos). */
export function NotFound({ soon = false }: { soon?: boolean }) {
  return (
    <div className="container section">
      <EmptyState
        title={soon ? 'Em breve' : 'Página não encontrada'}
        description={soon ? 'Esta área será construída na próxima etapa.' : 'O endereço não existe ou foi movido.'}
        action={<Link to="/" className="btn btn--primary">Voltar à página inicial</Link>}
      />
    </div>
  );
}
