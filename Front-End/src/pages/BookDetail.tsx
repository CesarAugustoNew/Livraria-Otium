import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CartButton } from '../components/books/CartButton';
import { FavoriteButton } from '../components/books/FavoriteButton';
import { Rating } from '../components/books/Rating';
import { ErrorState } from '../components/ui/ErrorState';
import { Skeleton } from '../components/ui/Skeleton';
import { useShop } from '../contexts/ShopContext';
import { useToast } from '../contexts/ToastContext';
import { useAsync } from '../hooks/useAsync';
import { bookService } from '../services/bookService';
import { formatPrice, installment } from '../utils/format';

const SINOPSE_LIMIT = 220;

export function BookDetail() {
  const { id = '' } = useParams();
  const { data: book, loading, error, reload } = useAsync((signal) => bookService.get(id, signal), [id]);
  const { favoriteIds, toggleFavorite, addToCart } = useShop();
  const { notify } = useToast();

  const [coverFailed, setCoverFailed] = useState(false);
  const [sinopseOpen, setSinopseOpen] = useState(false);
  const [cep, setCep] = useState('');

  if (loading) {
    return (
      <div className="container section book-detail">
        <div className="book-detail__grid">
          <Skeleton className="book-detail__cover-skeleton" />
          <div>
            <Skeleton className="skeleton--line" />
            <Skeleton className="skeleton--line skeleton--short" />
            <Skeleton className="skeleton--line skeleton--price" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="container section">
        <ErrorState message={error ?? 'Livro não encontrado.'} onRetry={error ? reload : undefined} />
      </div>
    );
  }

  const parcel = installment(book.price);
  const showCover = book.coverUrl && !coverFailed;
  const sinopseNeedsToggle = (book.description?.length ?? 0) > SINOPSE_LIMIT;
  const sinopseText =
    !sinopseNeedsToggle || sinopseOpen ? book.description : `${book.description!.slice(0, SINOPSE_LIMIT)}…`;

  return (
    <div className="container section book-detail">
      <nav className="breadcrumb" aria-label="Trilha de navegação">
        <Link to="/">Home</Link>
        <span aria-hidden="true">›</span>
        <Link to="/livros">Livros</Link>
        <span aria-hidden="true">›</span>
        <Link to="/livros">Assuntos</Link>
        <span aria-hidden="true">›</span>
        <Link to={`/livros?categoria=${book.category.id}`}>{book.category.name}</Link>
        <span aria-hidden="true">›</span>
        <span aria-current="page">{book.title}</span>
      </nav>

      <div className="book-detail__grid">
        <div className="book-detail__gallery">
          {showCover ? (
            <img
              src={book.coverUrl!}
              alt={`Capa de ${book.title}`}
              onError={() => setCoverFailed(true)}
            />
          ) : (
            <div className="book-detail__placeholder" aria-hidden="true">
              <span>{book.title}</span>
            </div>
          )}
        </div>

        <div className="book-detail__info">
          {book.discountPercent > 0 && (
            <span className="badge badge--discount badge--inline">-{book.discountPercent}%</span>
          )}
          <h1>{book.title}</h1>
          <p className="book-detail__author">Autor: {book.authors.join(', ')}</p>

          <div className="book-detail__meta">
            <Rating value={book.averageRating} count={book.reviewCount} />
            {book.isbn && <span className="book-detail__reference">Referência: {book.isbn}</span>}
          </div>

          <div className="book-detail__price">
            {book.originalPrice && book.originalPrice > book.price && (
              <span className="book-card__price-old">{formatPrice(book.originalPrice)}</span>
            )}
            <strong>{formatPrice(book.price)}</strong>
            {parcel.times > 1 && (
              <span className="book-detail__installment">
                Em até {parcel.times}x de {formatPrice(parcel.value)}
              </span>
            )}
          </div>

          <div className="book-detail__actions">
            <CartButton disabled={!book.available} onAdd={() => addToCart(book)} bookTitle={book.title} />
            <div className="book-detail__favorite">
              <FavoriteButton
                active={favoriteIds.has(book.id)}
                onToggle={() => toggleFavorite(book)}
                bookTitle={book.title}
              />
            </div>
          </div>
          {!book.available && <p className="book-card__stock is-out">Indisponível no momento</p>}

          <div className="shipping-calc">
            <div className="shipping-calc__head">
              <h2>Frete e prazo de entrega</h2>
              <a
                href="https://buscacepinter.correios.com.br/app/endereco/index.php"
                target="_blank"
                rel="noreferrer"
              >
                Não sei meu CEP ↗
              </a>
            </div>
            <form
              className="shipping-calc__form"
              onSubmit={(e) => {
                e.preventDefault();
                notify('Cálculo de frete em breve.');
              }}
            >
              <input
                type="text"
                inputMode="numeric"
                placeholder="00000-000"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                aria-label="CEP"
              />
              <button type="submit" className="btn btn--outline">
                Calcular o frete
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="book-detail__details">
        <div className="book-detail__text">
          <section>
            <h2>Sinopse</h2>
            {sinopseText ? (
              <p className="book-detail__sinopse">{sinopseText}</p>
            ) : (
              <p className="book-detail__muted">Sinopse não disponível.</p>
            )}
            {sinopseNeedsToggle && (
              <button type="button" className="link-btn" onClick={() => setSinopseOpen((o) => !o)}>
                {sinopseOpen ? 'Ver menos' : 'Ver mais'}
              </button>
            )}
          </section>
        </div>

        <aside className="spec-table">
          <h2>Especificações</h2>
          <dl>
            {book.isbn && (
              <div>
                <dt>ISBN</dt>
                <dd>{book.isbn}</dd>
              </div>
            )}
            {book.publisher && (
              <div>
                <dt>Editora</dt>
                <dd>{book.publisher}</dd>
              </div>
            )}
            <div>
              <dt>Idioma</dt>
              <dd>{book.language}</dd>
            </div>
            {book.pages && (
              <div>
                <dt>Número de páginas</dt>
                <dd>{book.pages}</dd>
              </div>
            )}
            {book.publishedAt && (
              <div>
                <dt>Ano</dt>
                <dd>{new Date(book.publishedAt).getFullYear()}</dd>
              </div>
            )}
            <div>
              <dt>Autor</dt>
              <dd>{book.authors.join(', ')}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}
