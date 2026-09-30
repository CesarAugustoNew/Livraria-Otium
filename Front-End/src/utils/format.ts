const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export const formatPrice = (value: number) => brl.format(value);

/** Parcelamento sem juros exibido no card: até 3x, com parcela mínima de R$ 25. Calculado, nunca armazenado. */
export function installment(price: number): { times: number; value: number } {
  const times = Math.min(3, Math.max(1, Math.floor(price / 25)));
  return { times, value: price / times };
}

/** Regra comercial exibida no topo do site e usada no carrinho/checkout. */
export const FREE_SHIPPING_THRESHOLD = 150;
export const FLAT_SHIPPING_FEE = 14.9;

/** Frete grátis acima do limiar; abaixo dele, taxa fixa. Cálculo real fica a cargo do backend no futuro. */
export function shippingFee(subtotal: number): number {
  return subtotal <= 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_FEE;
}

export const BRAZIL_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR',
  'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
];
