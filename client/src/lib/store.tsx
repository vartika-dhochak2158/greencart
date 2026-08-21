import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { products, type Product } from "./data";

export type CartLine = {
  key: string;
  product: Product;
  qty: number;
  addons: { label: string; price: number }[];
};

type StoreValue = {
  lines: CartLine[];
  count: number;
  favorites: string[];
  promo: string | null;
  tip: number;
  itemTotal: number;
  discount: number;
  deliveryFee: number;
  taxes: number;
  savings: number;
  grandTotal: number;
  addToCart: (product: Product, qty?: number, addons?: { label: string; price: number }[]) => void;
  setQty: (key: string, qty: number) => void;
  removeLine: (key: string) => void;
  clearCart: () => void;
  toggleFavorite: (id: string) => void;
  applyPromo: (code: string) => boolean;
  setTip: (v: number) => void;
};

const StoreContext = createContext<StoreValue | null>(null);

const PROMOS: Record<string, number> = { FRESH20: 0.2, GREEN10: 0.1, WELCOME15: 0.15 };

export function StoreProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([
    { key: "croissant", product: products[0]!, qty: 2, addons: [] },
    { key: "strawberries", product: products[1]!, qty: 1, addons: [] },
  ]);
  const [favorites, setFavorites] = useState<string[]>(["strawberries", "coffee"]);
  const [promo, setPromo] = useState<string | null>(null);
  const [tip, setTip] = useState(2);

  const addToCart: StoreValue["addToCart"] = useCallback((product, qty = 1, addons = []) => {
    const key = product.id + (addons.length ? "::" + addons.map((a) => a.label).join("|") : "");
    setLines((prev) => {
      const existing = prev.find((l) => l.key === key);
      if (existing)
        return prev.map((l) => (l.key === key ? { ...l, qty: l.qty + qty } : l));
      return [...prev, { key, product, qty, addons }];
    });
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setLines((prev) =>
      qty <= 0 ? prev.filter((l) => l.key !== key) : prev.map((l) => (l.key === key ? { ...l, qty } : l)),
    );
  }, []);

  const removeLine = useCallback((key: string) => {
    setLines((prev) => prev.filter((l) => l.key !== key));
  }, []);

  const clearCart = useCallback(() => setLines([]), []);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  }, []);

  const applyPromo = useCallback((code: string) => {
    const normalized = code.trim().toUpperCase();
    if (PROMOS[normalized]) {
      setPromo(normalized);
      return true;
    }
    return false;
  }, []);

  const value = useMemo<StoreValue>(() => {
    const itemTotal = lines.reduce(
      (sum, l) => sum + (l.product.price + l.addons.reduce((a, b) => a + b.price, 0)) * l.qty,
      0,
    );
    const baseSavings = lines.reduce(
      (sum, l) => sum + (l.product.oldPrice ? (l.product.oldPrice - l.product.price) * l.qty : 0),
      0,
    );
    const discount = promo ? itemTotal * (PROMOS[promo] ?? 0) : 0;
    const deliveryFee = itemTotal > 35 || itemTotal === 0 ? 0 : 2.49;
    const taxes = (itemTotal - discount) * 0.0875;
    const grandTotal = Math.max(0, itemTotal - discount + deliveryFee + taxes + tip);
    return {
      lines,
      count: lines.reduce((s, l) => s + l.qty, 0),
      favorites,
      promo,
      tip,
      itemTotal,
      discount,
      deliveryFee,
      taxes,
      savings: baseSavings + discount + (deliveryFee === 0 && itemTotal > 0 ? 2.49 : 0),
      grandTotal,
      addToCart,
      setQty,
      removeLine,
      clearCart,
      toggleFavorite,
      applyPromo,
      setTip,
    };
  }, [lines, favorites, promo, tip, addToCart, setQty, removeLine, clearCart, toggleFavorite, applyPromo]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

export const money = (n: number) => `$${n.toFixed(2)}`;
