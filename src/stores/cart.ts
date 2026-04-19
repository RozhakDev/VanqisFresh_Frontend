import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from '@/types';

/**
 * Menormalkan jumlah agar selalu berupa bilangan bulat positif.
 *
 * @param value - Nilai jumlah dari input pengguna atau state.
 * @returns Jumlah yang valid, atau `null` jika tidak layak dipakai.
 */
const normalizeQuantity = (value: number) => {
  if (!Number.isFinite(value)) {
    return null;
  }

  const quantity = Math.floor(value);
  return quantity > 0 ? quantity : null;
};

/**
 * Menormalkan stok agar tidak bernilai negatif dan tetap bulat.
 *
 * @param value - Nilai stok dari data produk.
 * @returns Stok valid yang minimal bernilai nol.
 */
const normalizeStock = (value: number) => {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.floor(value));
};

interface CartStore {
  items: CartItem[];
  /**
   * Menambahkan produk ke keranjang dengan batas stok yang tersedia.
   */
  addItem: (product: Product, quantity?: number) => void;
  /**
   * Menghapus produk tertentu dari keranjang.
   */
  removeItem: (productId: number) => void;
  /**
   * Memperbarui jumlah produk dan menyesuaikannya dengan stok.
   */
  updateQuantity: (productId: number, quantity: number) => void;
  /**
   * Mengosongkan seluruh isi keranjang.
   */
  clearCart: () => void;
  /**
   * Menghitung total item aktif di keranjang.
   */
  totalItems: () => number;
  /**
   * Menghitung total harga seluruh item di keranjang.
   */
  totalPrice: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      /**
       * Menambahkan produk ke keranjang dengan validasi jumlah dan stok.
       */
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

      /**
       * Menghapus satu item berdasarkan ID produk.
       */
      removeItem: (productId) => {
        set({ items: get().items.filter(i => i.product.id !== productId) });
      },

      /**
       * Menetapkan jumlah baru untuk item tertentu.
       */
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

      /**
       * Menghapus semua item yang tersimpan di keranjang.
       */
      clearCart: () => set({ items: [] }),
      /**
       * Menjumlahkan semua kuantitas item aktif di keranjang.
       */
      totalItems: () => get().items.reduce((sum, i) => sum + (normalizeQuantity(i.quantity) ?? 0), 0),
      /**
       * Menjumlahkan total nominal berdasarkan harga dan kuantitas.
       */
      totalPrice: () => get().items.reduce((sum, i) => {
        const quantity = normalizeQuantity(i.quantity) ?? 0;
        const price = Number.isFinite(i.product.price) ? i.product.price : 0;
        return sum + price * quantity;
      }, 0),
    }),
    { name: 'vanqisfresh-cart' }
  )
);
