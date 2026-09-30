/**
 * Selos de formas de pagamento. São ícones genéricos (cartão + rótulo, código de barras, marca "Pix"
 * em texto) desenhados para este projeto — não reproduzem as artes oficiais das bandeiras.
 */
interface Brand {
  label: string;
  bg: string;
  fg: string;
}

export const CARD_BRANDS: Brand[] = [
  { label: 'Visa', bg: '#1a3a8f', fg: '#fff' },
  { label: 'Mastercard', bg: '#eb5b25', fg: '#fff' },
  { label: 'Elo', bg: '#2f2a26', fg: '#fff' },
  { label: 'Amex', bg: '#1f7a8c', fg: '#fff' },
];

export function CardBadge({ label, bg, fg }: Brand) {
  return (
    <svg width="52" height="34" viewBox="0 0 52 34" role="img" aria-label={`Cartão ${label}`}>
      <rect width="52" height="34" rx="5" fill={bg} />
      <rect y="9" width="52" height="5" fill={fg} opacity=".25" />
      <text
        x="26"
        y="27"
        textAnchor="middle"
        fontFamily="system-ui, sans-serif"
        fontSize={label.length > 7 ? 6 : label.length > 4 ? 7.5 : 9}
        fontWeight="700"
        letterSpacing=".02em"
        fill={fg}
      >
        {label.toUpperCase()}
      </text>
    </svg>
  );
}

export function PixBadge() {
  return (
    <svg width="52" height="34" viewBox="0 0 52 34" role="img" aria-label="Pix">
      <rect width="52" height="34" rx="5" fill="#0b7f5b" />
      <g transform="translate(26 17) rotate(45)" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinejoin="round">
        <rect x="-7" y="-7" width="14" height="14" rx="3" />
      </g>
    </svg>
  );
}

export function BoletoBadge() {
  const bars = [3, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 3, 1];
  return (
    <svg width="52" height="34" viewBox="0 0 52 34" role="img" aria-label="Boleto bancário">
      <rect width="52" height="34" rx="5" fill="#fff" stroke="#d8cfbf" />
      {(() => {
        let x = 6;
        return bars.map((w, i) => {
          const rect = <rect key={i} x={x} y="8" width={w} height="18" fill="#23201d" />;
          x += w + 1.4;
          return rect;
        });
      })()}
    </svg>
  );
}

export function PaymentIcons() {
  return (
    <ul className="payment-icons">
      {CARD_BRANDS.map((b) => (
        <li key={b.label}>
          <CardBadge {...b} />
        </li>
      ))}
      <li>
        <PixBadge />
      </li>
      <li>
        <BoletoBadge />
      </li>
    </ul>
  );
}
