import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../../contexts/ShopContext';
import type { BookSummary } from '../../types';
import { formatPrice, installment } from '../../utils/format';
import { CartButton } from './CartButton';
import { FavoriteButton } from './FavoriteButton';
import { Rating } from './Rating';

export function BookCard({ book }: { book: BookSummary }) {
  const { favoriteIds, toggleFavorite, addToCart } = useShop();
  const [coverFailed, setCoverFailed] = useState(false);
  const parcel = installment(book.price);
  const showCover = book.coverUrl && !coverFailed;

  return (
    <article className="book-card">
      <div className="book-card__media">
        {book.discountPercent > 0 ? (
          <span className="badge badge--discount">-{book.discountPercent}%</span>
        ) : (
          book.release && <span className="badge">Lançamento</span>
        )}
        <FavoriteButton
          active={favoriteIds.has(book.id)}
          onToggle={() => toggleFavorite(book)}
          bookTitle={book.title}
        />
        <Link to={`/livro/${book.id}`} className="book-card__media-link" tabIndex={-1} aria-hidden="true">
          {showCover ? (
            <img
              src={book.coverUrl!}
              alt={`Capa de ${book.title}`}
              loading="lazy"
              onError={() => setCoverFailed(true)}
            />
          ) : (
            // fallback quando não há capa ou a imagem falha: o título continua visível
            <div className="book-card__placeholder" aria-hidden="true">
              <span>{book.title}</span>
            </div>
          )}
        </Link>
      </div>

      <div className="book-card__body">
        <h3 className="book-card__title">
          <Link to={`/livro/${book.id}`}>{book.title}</Link>
        </h3>
        <p className="book-card__author">{book.authors.join(', ')}</p>
        <Rating value={book.averageRating} count={book.reviewCount} />
        <div className="book-card__price-row">
          {book.originalPrice && book.originalPrice > book.price && (
            <span className="book-card__price-old">{formatPrice(book.originalPrice)}</span>
          )}
          <p className="book-card__price">{formatPrice(book.price)}</p>
        </div>
        <p className="book-card__installment">
          {parcel.times}x de {formatPrice(parcel.value)} sem juros
        </p>
        <p className={`book-card__stock ${book.available ? 'is-in' : 'is-out'}`}>
          {book.available ? 'Em estoque' : 'Indisponível'}
        </p>
      </div>

      <CartButton disabled={!book.available} onAdd={() => addToCart(book)} bookTitle={book.title} />
    </article>
  );
}
