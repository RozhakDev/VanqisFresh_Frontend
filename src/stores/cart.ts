import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from '@/types';

const normalizeQuantity = (value: number) => {
  if (!Number.isFinite(value)) {
    return null;
  }

  const quantity = Math.floor(value);
  return quantity > 0 ? quantity : null;
};

const normalizeStock = (value: number) => {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.floor(value));
};

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1) => {
        const nextQuantity = normalizeQuantity(quantity);
        const stock = normalizeStock(product.stock);

        if (nextQuantity === null || stock <= 0) {
          return;
        }

        const items = get().items;
        const existing = items.find(i => i.product.id === product.id);
        if (existing) {
          const currentQuantity = normalizeQuantity(existing.quantity) ?? 0;
          const newQty = Math.min(currentQuantity + nextQuantity, stock);

          if (newQty <= 0) {
            set({ items: items.filter(i => i.product.id !== product.id) });
            return;
          }

          set({ items: items.map(i => i.product.id === product.id ? { ...i, quantity: newQty } : i) });
        } else {
          set({ items: [...items, { product, quantity: Math.min(nextQuantity, stock) }] });
        }
      },

      removeItem: (productId) => {
        set({ items: get().items.filter(i => i.product.id !== productId) });
      },

      updateQuantity: (productId, quantity) => {
        const nextQuantity = normalizeQuantity(quantity);

        if (nextQuantity === null) {
          get().removeItem(productId);
          return;
        }

        const items = get().items;
        const target = items.find(i => i.product.id === productId);
        const stock = normalizeStock(target?.product.stock ?? 0);

        if (stock <= 0) {
          get().removeItem(productId);
          return;
        }

        const clampedQuantity = Math.min(nextQuantity, stock);

        if (clampedQuantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set({
          items: items.map(i =>
            i.product.id === productId ? { ...i, quantity: clampedQuantity } : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((sum, i) => sum + (normalizeQuantity(i.quantity) ?? 0), 0),
      totalPrice: () => get().items.reduce((sum, i) => {
        const quantity = normalizeQuantity(i.quantity) ?? 0;
        const price = Number.isFinite(i.product.price) ? i.product.price : 0;
        return sum + price * quantity;
      }, 0),
    }),
    { name: 'vanqisfresh-cart' }
  )
);
