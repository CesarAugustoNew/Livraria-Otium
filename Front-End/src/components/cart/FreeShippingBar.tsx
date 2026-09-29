import { FREE_SHIPPING_THRESHOLD, formatPrice } from '../../utils/format';

export function FreeShippingBar({ subtotal }: { subtotal: number }) {
  const reached = subtotal >= FREE_SHIPPING_THRESHOLD;
  const percent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const missing = FREE_SHIPPING_THRESHOLD - subtotal;

  return (
    <div className="shipping-bar">
      <div className="shipping-bar__track" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
        <div className="shipping-bar__fill" style={{ width: `${percent}%` }} />
      </div>
      <p className="shipping-bar__label">
        {reached ? 'Frete grátis' : `Faltam ${formatPrice(missing)} para o frete grátis`}
      </p>
    </div>
  );
}
