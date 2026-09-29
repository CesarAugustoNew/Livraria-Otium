import { useEffect, useState, type FormEvent } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { CardBadge, CARD_BRANDS } from '../components/ui/PaymentIcons';
import { BarcodeIcon, CheckCircleIcon, CreditCardIcon, QrCodeIcon } from '../components/ui/Icons';
import { useAuth } from '../contexts/AuthContext';
import { useShop } from '../contexts/ShopContext';
import { BRAZIL_STATES, formatPrice, installment, shippingFee } from '../utils/format';

type PaymentMethod = 'card' | 'pix' | 'boleto';

interface AddressForm {
  recipient: string;
  zipCode: string;
  street: string;
  number: string;
  complement: string;
  district: string;
  city: string;
  state: string;
}

const EMPTY_ADDRESS: AddressForm = {
  recipient: '',
  zipCode: '',
  street: '',
  number: '',
  complement: '',
  district: '',
  city: '',
  state: '',
};

export function Checkout() {
  const { user } = useAuth();
  const { cartItems, cartSubtotal, coupon, discount, cartTotal, clearCart } = useShop();

  const [address, setAddress] = useState<AddressForm>({ ...EMPTY_ADDRESS, recipient: user?.name ?? '' });
  const [method, setMethod] = useState<PaymentMethod>('card');
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '', installments: 1 });
  const [submitting, setSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  const freight = shippingFee(cartSubtotal);
  const total = cartTotal + freight;

  // Reserva o número antes de limpar o carrinho, para não recalcular após clearCart().
  useEffect(() => {
    if (orderNumber) window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [orderNumber]);

  if (!user) {
    return <Navigate to="/entrar" state={{ from: '/checkout' }} replace />;
  }
  if (cartItems.length === 0 && !orderNumber) {
    return <Navigate to="/carrinho" replace />;
  }

  function updateAddress<K extends keyof AddressForm>(key: K, value: AddressForm[K]) {
    setAddress((a) => ({ ...a, [key]: value }));
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    // TODO: substituir pela chamada real a POST /api/orders quando o endpoint existir.
    await new Promise((r) => setTimeout(r, 900));
    setOrderNumber(String(Math.floor(100000 + Math.random() * 900000)));
    clearCart();
    setSubmitting(false);
  }

  if (orderNumber) {
    return (
      <div className="container section">
        <div className="order-success">
          <CheckCircleIcon width={56} height={56} />
          <h1>Pedido realizado com sucesso!</h1>
          <p>
            Número do pedido: <strong>#{orderNumber}</strong>
          </p>
          <p>Enviamos os detalhes para o seu e-mail. O prazo estimado de entrega é de 5 a 10 dias úteis.</p>
          <div className="order-success__actions">
            <Link to="/" className="btn btn--primary">
              Voltar à loja
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container section checkout">
      <h1 className="checkout__title">Finalizar compra</h1>

      <form className="checkout-grid" onSubmit={submit}>
        <div className="checkout-main">
          <section className="checkout-card">
            <h2>Endereço de entrega</h2>
            <div className="form-grid">
              <label className="field field--full">
                <span>Nome do destinatário</span>
                <input
                  required
                  value={address.recipient}
                  onChange={(e) => updateAddress('recipient', e.target.value)}
                />
              </label>
              <label className="field">
                <span>CEP</span>
                <input
                  required
                  inputMode="numeric"
                  placeholder="00000-000"
                  value={address.zipCode}
                  onChange={(e) => updateAddress('zipCode', e.target.value)}
                />
              </label>
              <label className="field field--full">
                <span>Rua</span>
                <input required value={address.street} onChange={(e) => updateAddress('street', e.target.value)} />
              </label>
              <label className="field">
                <span>Número</span>
                <input required value={address.number} onChange={(e) => updateAddress('number', e.target.value)} />
              </label>
              <label className="field">
                <span>Complemento (opcional)</span>
                <input value={address.complement} onChange={(e) => updateAddress('complement', e.target.value)} />
              </label>
              <label className="field">
                <span>Bairro</span>
                <input
                  required
                  value={address.district}
                  onChange={(e) => updateAddress('district', e.target.value)}
                />
              </label>
              <label className="field">
                <span>Cidade</span>
                <input required value={address.city} onChange={(e) => updateAddress('city', e.target.value)} />
              </label>
              <label className="field">
                <span>Estado</span>
                <select required value={address.state} onChange={(e) => updateAddress('state', e.target.value)}>
                  <option value="" disabled>
                    UF
                  </option>
                  {BRAZIL_STATES.map((uf) => (
                    <option key={uf} value={uf}>
                      {uf}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          <section className="checkout-card">
            <h2>Forma de pagamento</h2>
            <div className="payment-methods">
              <label className={`payment-method${method === 'card' ? ' is-selected' : ''}`}>
                <input type="radio" name="method" checked={method === 'card'} onChange={() => setMethod('card')} />
                <CreditCardIcon width={22} height={22} />
                <span>Cartão de crédito</span>
              </label>
              <label className={`payment-method${method === 'pix' ? ' is-selected' : ''}`}>
                <input type="radio" name="method" checked={method === 'pix'} onChange={() => setMethod('pix')} />
                <QrCodeIcon width={22} height={22} />
                <span>Pix</span>
              </label>
              <label className={`payment-method${method === 'boleto' ? ' is-selected' : ''}`}>
                <input type="radio" name="method" checked={method === 'boleto'} onChange={() => setMethod('boleto')} />
                <BarcodeIcon width={22} height={22} />
                <span>Boleto</span>
              </label>
            </div>

            {method === 'card' && (
              <div className="payment-detail">
                <div className="payment-detail__brands">
                  {CARD_BRANDS.map((b) => (
                    <CardBadge key={b.label} {...b} />
                  ))}
                </div>
                <div className="form-grid">
                  <label className="field field--full">
                    <span>Número do cartão</span>
                    <input
                      required
                      inputMode="numeric"
                      placeholder="0000 0000 0000 0000"
                      value={card.number}
                      onChange={(e) => setCard((c) => ({ ...c, number: e.target.value }))}
                    />
                  </label>
                  <label className="field field--full">
                    <span>Nome impresso no cartão</span>
                    <input
                      required
                      value={card.name}
                      onChange={(e) => setCard((c) => ({ ...c, name: e.target.value }))}
                    />
                  </label>
                  <label className="field">
                    <span>Validade</span>
                    <input
                      required
                      placeholder="MM/AA"
                      value={card.expiry}
                      onChange={(e) => setCard((c) => ({ ...c, expiry: e.target.value }))}
                    />
                  </label>
                  <label className="field">
                    <span>CVV</span>
                    <input
                      required
                      inputMode="numeric"
                      placeholder="123"
                      value={card.cvv}
                      onChange={(e) => setCard((c) => ({ ...c, cvv: e.target.value }))}
                    />
                  </label>
                  <label className="field field--full">
                    <span>Parcelas</span>
                    <select
                      value={card.installments}
                      onChange={(e) => setCard((c) => ({ ...c, installments: Number(e.target.value) }))}
                    >
                      {Array.from({ length: installment(total).times }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>
                          {n}x de {formatPrice(total / n)} sem juros
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
            )}

            {method === 'pix' && (
              <div className="payment-detail payment-detail--info">
                <QrCodeIcon width={64} height={64} />
                <p>Ao confirmar o pedido, você recebe o QR Code e o código copia-e-cola para pagar com Pix.</p>
              </div>
            )}

            {method === 'boleto' && (
              <div className="payment-detail payment-detail--info">
                <BarcodeIcon width={64} height={64} />
                <p>O boleto é gerado após a confirmação do pedido e vence em 3 dias úteis.</p>
              </div>
            )}
          </section>
        </div>

        <aside className="checkout-summary">
          <h2>Resumo do pedido</h2>
          <ul className="checkout-summary__items">
            {cartItems.map(({ book, quantity }) => (
              <li key={book.id}>
                <span>
                  {book.title} <span className="checkout-summary__qty">×{quantity}</span>
                </span>
                <span>{formatPrice(book.price * quantity)}</span>
              </li>
            ))}
          </ul>

          <div className="cart-summary__totals">
            <div className="cart-summary__row">
              <span>Subtotal</span>
              <span>{formatPrice(cartSubtotal)}</span>
            </div>
            {coupon && (
              <div className="cart-summary__row cart-summary__row--discount">
                <span>Desconto ({coupon.code})</span>
                <span>-{formatPrice(discount)}</span>
              </div>
            )}
            <div className="cart-summary__row">
              <span>Frete</span>
              <span>{freight === 0 ? 'Grátis' : formatPrice(freight)}</span>
            </div>
            <div className="cart-summary__row cart-summary__row--total">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          <button type="submit" className="btn btn--primary btn--block" disabled={submitting}>
            {submitting ? 'Processando…' : 'Finalizar pedido'}
          </button>
          <Link to="/carrinho" className="cart-summary__continue">
            Voltar ao carrinho
          </Link>
        </aside>
      </form>
    </div>
  );
}
