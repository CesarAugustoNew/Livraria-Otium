import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { BookSummary } from '../types';
import { useToast } from './ToastContext';

export interface CartItem {
  book: BookSummary;
  quantity: number;
}

interface Coupon {
  code: string;
  percentOff: number;
}

/** Cupons de demonstração: sem backend de cupons ainda, valida localmente. */
const KNOWN_COUPONS: Record<string, number> = { OTIUM10: 10, BEMVINDO: 15 };
const MAX_QUANTITY_PER_ITEM = 10;

/**
 * Estado local de carrinho e favoritos.
 * TEMPORÁRIO: quando /api/cart, /api/favorites e /api/orders existirem, as funções abaixo
 * passam a chamar os serviços correspondentes. Os componentes não precisam mudar.
 */
interface ShopState {
  cartItems: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  coupon: Coupon | null;
  discount: number;
  cartTotal: number;
  favoriteIds: ReadonlySet<string>;
  addToCart: (book: BookSummary, quantity?: number) => void;
  removeFromCart: (bookId: string) => void;
  setQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  toggleFavorite: (book: BookSummary) => void;
}

const ShopContext = createContext<ShopState | null>(null);

export function ShopProvider({ children }: { children: ReactNode }) {
  const { notify } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [coupon, setCoupon] = useState<Coupon | null>(null);

  const addToCart = useCallback(
    (book: BookSummary, quantity = 1) => {
      setCartItems((prev) => {
        const existing = prev.find((i) => i.book.id === book.id);
        if (existing) {
          const next = Math.min(MAX_QUANTITY_PER_ITEM, existing.quantity + quantity);
          return prev.map((i) => (i.book.id === book.id ? { ...i, quantity: next } : i));
        }
        return [...prev, { book, quantity: Math.min(MAX_QUANTITY_PER_ITEM, quantity) }];
      });
      notify(`“${book.title}” foi adicionado ao carrinho.`);
    },
    [notify],
  );

  const removeFromCart = useCallback(
    (bookId: string) => {
      setCartItems((prev) => prev.filter((i) => i.book.id !== bookId));
      notify('Item removido do carrinho.');
    },
    [notify],
  );

  const setQuantity = useCallback((bookId: string, quantity: number) => {
    setCartItems((prev) =>
      prev.map((i) =>
        i.book.id === bookId ? { ...i, quantity: Math.min(MAX_QUANTITY_PER_ITEM, Math.max(1, quantity)) } : i,
      ),
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    setCoupon(null);
  }, []);

  const applyCoupon = useCallback(
    (code: string) => {
      const normalized = code.trim().toUpperCase();
      const percentOff = KNOWN_COUPONS[normalized];
      if (!percentOff) {
        notify('Cupom inválido ou expirado.');
        return false;
      }
      setCoupon({ code: normalized, percentOff });
      notify(`Cupom ${normalized} aplicado: ${percentOff}% de desconto.`);
      return true;
    },
    [notify],
  );

  const removeCoupon = useCallback(() => setCoupon(null), []);

  const toggleFavorite = useCallback(
    (book: BookSummary) => {
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        if (next.has(book.id)) {
          next.delete(book.id);
          notify('Removido dos favoritos.');
        } else {
          next.add(book.id);
          notify('Adicionado aos favoritos.');
        }
        return next;
      });
    },
    [notify],
  );

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const cartSubtotal = cartItems.reduce((sum, i) => sum + i.book.price * i.quantity, 0);
  const discount = coupon ? (cartSubtotal * coupon.percentOff) / 100 : 0;
  const cartTotal = Math.max(0, cartSubtotal - discount);

  const value = useMemo(
    () => ({
      cartItems,
      cartCount,
      cartSubtotal,
      coupon,
      discount,
      cartTotal,
      favoriteIds,
      addToCart,
      removeFromCart,
      setQuantity,
      clearCart,
      applyCoupon,
      removeCoupon,
      toggleFavorite,
    }),
    [cartItems, cartCount, cartSubtotal, coupon, discount, cartTotal, favoriteIds, addToCart, removeFromCart,
      setQuantity, clearCart, applyCoupon, removeCoupon, toggleFavorite],
  );
  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop(): ShopState {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error('useShop deve ser usado dentro de ShopProvider');
  return ctx;
}
