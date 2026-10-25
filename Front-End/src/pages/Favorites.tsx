import { Link } from 'react-router-dom';
import { BookGrid } from '../components/books/BookGrid';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';
import { Loading } from '../components/ui/Loading';
import { useAuth } from '../contexts/AuthContext';
import { useShop } from '../contexts/ShopContext';
import { useAsync } from '../hooks/useAsync';
import { favoriteService } from '../services/favoriteService';

export function Favorites() {
  const { user, loading: authLoading } = useAuth();
  const { favoriteIds, favoritesReady } = useShop();
  const { data, loading, error, reload } = useAsync(
    (signal) => (user ? favoriteService.list(signal) : Promise.resolve([])),
    [user?.id],
  );

  if (authLoading) {
    return (
      <div className="container section">
        <Loading />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container section">
        <EmptyState
          title="Entre para ver seus favoritos"
          description="Os livros que você marcar com a estrela ficam salvos na sua conta."
          action={
            <Link to="/entrar" state={{ from: '/favoritos' }} className="btn btn--primary">
              Entrar
            </Link>
          }
        />
      </div>
    );
  }

  // desfavoritar nesta página tira o livro da lista na hora, sem esperar outra busca
  const books = (data ?? []).filter((b) => !favoritesReady || favoriteIds.has(b.id));

  return (
    <div className="container section">
      <div className="catalog__head">
        <h1>Meus favoritos</h1>
      </div>
      {error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : !loading && books.length === 0 ? (
        <EmptyState
          title="Nenhum livro salvo ainda"
          description="Toque na estrela de um livro para guardá-lo aqui."
          action={
            <Link to="/livros" className="btn btn--primary">
              Ver o catálogo
            </Link>
          }
        />
      ) : (
        <BookGrid books={books} loading={loading} wrap skeletonCount={4} />
      )}
    </div>
  );
}
