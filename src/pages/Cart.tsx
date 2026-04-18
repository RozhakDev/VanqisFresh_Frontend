import { Link } from 'react-router-dom';
import { useCart } from '@/stores/cart';
import { formatPrice } from '@/lib/api';
import { Minus, Plus, Trash2, Package } from 'lucide-react';
import EmptyState from '@/components/EmptyState';

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="container-app py-6">
        <h1 className="text-2xl font-bold mb-6">Keranjang</h1>
        <EmptyState title="Keranjang kosong" description="Belum ada produk di keranjang" />
      </div>
    );
  }

  return (
    <div className="container-app py-6">
      <h1 className="text-2xl font-bold mb-6">Keranjang</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="bg-card rounded-2xl border p-4 flex gap-4">
              <div className="w-20 h-20 rounded-xl bg-secondary overflow-hidden shrink-0">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-6 h-6 text-muted-foreground/40" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm line-clamp-1">{product.name}</h3>
                <p className="text-xs text-muted-foreground mb-2">{product.category_name}</p>
                <p className="font-bold text-sm">{formatPrice(product.price)}</p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button
                  onClick={() => removeItem(product.id)}
                  className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-0 border rounded-lg overflow-hidden">
                  <button onClick={() => updateQuantity(product.id, quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-secondary text-xs">
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center text-xs font-semibold">{quantity}</span>
                  <button onClick={() => updateQuantity(product.id, quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-secondary text-xs">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-card rounded-2xl border p-6 sticky top-24">
            <h2 className="font-bold mb-4">Ringkasan</h2>
            <div className="space-y-2 text-sm mb-6">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex justify-between text-muted-foreground">
                  <span className="truncate mr-2">{product.name} x{quantity}</span>
                  <span className="shrink-0">{formatPrice(product.price * quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 flex justify-between font-bold mb-6">
              <span>Total</span>
              <span>{formatPrice(totalPrice())}</span>
            </div>
            <Link
              to="/checkout"
              className="block w-full text-center py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Lanjut ke Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
