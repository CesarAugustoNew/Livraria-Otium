import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FreeShippingBar } from '../components/cart/FreeShippingBar';
import { QuantityControl } from '../components/cart/QuantityControl';
import { EmptyState } from '../components/ui/EmptyState';
import { CloseIcon, CopyIcon, TrashIcon } from '../components/ui/Icons';
import { useShop } from '../contexts/ShopContext';
import { useToast } from '../contexts/ToastContext';
import { formatPrice } from '../utils/format';

export function Cart() {
  const { cartItems, cartSubtotal, coupon, discount, cartTotal, removeFromCart, setQuantity, applyCoupon,
    removeCoupon } = useShop();
  const { notify } = useToast();
  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState('');

  function submitCoupon(e: FormEvent) {
    e.preventDefault();
    if (!couponInput.trim()) return;
    if (applyCoupon(couponInput)) setCouponInput('');
  }

  function copyShareLink() {
    navigator.clipboard?.writeText(window.location.origin + '/carrinho').then(
      () => notify('Link do carrinho copiado!'),
      () => notify('Não foi possível copiar o link.'),
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container section">
        <EmptyState
          title="Seu carrinho está vazio"
          description="Que tal descobrir sua próxima leitura?"
          action={
            <Link to="/livros" className="btn btn--primary">
              Ver livros
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="container section cart-page">
      <div className="cart-page__head">
        <button type="button" className="icon-btn cart-page__close" onClick={() => navigate(-1)} aria-label="Fechar">
          <CloseIcon />
        </button>
        <h1>Meu carrinho</h1>
      </div>

      <div className="cart-grid">
        <ul className="cart-list">
          {cartItems.map(({ book, quantity }) => (
            <li key={book.id} className="cart-item">
              <div className="cart-item__cover">
                {book.coverUrl ? (
                  <img src={book.coverUrl} alt={`Capa de ${book.title}`} />
                ) : (
                  <div className="cart-item__placeholder" aria-hidden="true" />
                )}
              </div>

              <div className="cart-item__info">
                <div className="cart-item__head">
                  <div>
                    <p className="cart-item__title">{book.title}</p>
                    <p className="cart-item__seller">Vendido e entregue por Otium</p>
                  </div>
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => removeFromCart(book.id)}
                    aria-label={`Remover ${book.title} do carrinho`}
                  >
                    <TrashIcon width={20} height={20} />
                  </button>
                </div>

                <div className="cart-item__footer">
                  <QuantityControl quantity={quantity} onChange={(q) => setQuantity(book.id, q)} label={book.title} />
                  <p className="cart-item__price">{formatPrice(book.price * quantity)}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="cart-summary">
          <div className="cart-summary__card cart-summary__card--share">
            <h2>Compartilhar carrinho</h2>
            <div className="share-field">
              <input type="text" readOnly value={`${window.location.origin}/carrinho`} aria-label="Link do carrinho" />
              <button type="button" className="btn btn--outline" onClick={copyShareLink}>
                <CopyIcon width={16} height={16} /> Copiar
              </button>
            </div>
          </div>

          <div className="cart-summary__card cart-summary__card--delivery">
            <h2>Entrega</h2>
            <p>Veja as opções de entrega para seus itens, com todos os prazos e valores.</p>
            <button type="button" className="btn btn--outline" onClick={() => notify('Cálculo de frete em breve.')}>
              Calcular
            </button>
          </div>

          <form className="cart-summary__card cart-summary__card--coupon" onSubmit={submitCoupon}>
            <h2>Cupom de desconto</h2>
            {coupon ? (
              <div className="coupon-applied">
                <span>
                  Cupom <strong>{coupon.code}</strong> aplicado ({coupon.percentOff}% off)
                </span>
                <button type="button" className="filters__clear" onClick={removeCoupon}>
                  Remover
                </button>
              </div>
            ) : (
              <div className="share-field">
                <input
                  type="text"
                  placeholder="Código"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                />
                <button type="submit" className="btn btn--outline">
                  Adicionar
                </button>
              </div>
            )}
          </form>

          <FreeShippingBar subtotal={cartSubtotal} />

          <div className="cart-summary__totals">
            <div className="cart-summary__row">
              <span>Subtotal</span>
              <span>{formatPrice(cartSubtotal)}</span>
            </div>
            {coupon && (
              <div className="cart-summary__row cart-summary__row--discount">
                <span>Desconto</span>
                <span>-{formatPrice(discount)}</span>
              </div>
            )}
            <div className="cart-summary__row cart-summary__row--total">
              <span>Total</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
          </div>

          <button type="button" className="btn btn--primary btn--block" onClick={() => navigate('/checkout')}>
            Ir para o checkout
          </button>
          <Link to="/livros" className="cart-summary__continue">
            Continuar comprando
          </Link>
        </aside>
      </div>
    </div>
  );
}
