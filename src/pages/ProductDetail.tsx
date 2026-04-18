import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProduct } from '@/lib/api';
import { formatPrice } from '@/lib/api';
import type { Product } from '@/types';
import { useCart } from '@/stores/cart';
import { useToast } from '@/hooks/use-toast';
import { DetailSkeleton } from '@/components/LoadingSkeleton';
import { ArrowLeft, Minus, Plus, ShoppingCart, Package, AlertCircle } from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [qty, setQty] = useState(1);
  const addItem = useCart(s => s.addItem);
  const { toast } = useToast();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getProduct(Number(id))
      .then(setProduct)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <DetailSkeleton />;
  if (error || !product) {
    return (
      <div className="container-app py-20 text-center">
        <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="font-semibold text-lg mb-2">Produk tidak ditemukan</h2>
        <Link to="/" className="text-sm text-accent-foreground hover:underline">Kembali ke katalog</Link>
      </div>
    );
  }

  const handleAdd = () => {
    addItem(product, qty);
    toast({ title: 'Ditambahkan ke keranjang', description: `${qty}x ${product.name}` });
  };

  return (
    <div className="container-app py-6">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Kembali
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="aspect-square bg-secondary rounded-2xl overflow-hidden">
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-20 h-20 text-muted-foreground/30" />
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <span className="text-sm font-medium text-accent-foreground bg-accent w-fit px-3 py-1 rounded-full mb-3">
            {product.category_name}
          </span>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-2xl font-bold text-accent-foreground mb-4">{formatPrice(product.price)}</p>

          <p className="text-muted-foreground leading-relaxed mb-6">{product.description}</p>

          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-8">
            <span className={`w-2 h-2 rounded-full ${product.is_available && product.stock > 0 ? 'bg-primary' : 'bg-destructive'}`} />
            {product.is_available && product.stock > 0
              ? `Stok tersedia: ${product.stock}`
              : 'Stok habis'}
          </div>

          {product.is_available && product.stock > 0 && (
            <div className="mt-auto flex flex-col sm:flex-row gap-3">
              <div className="flex items-center gap-0 border rounded-xl overflow-hidden">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-11 h-11 flex items-center justify-center hover:bg-secondary transition-colors">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-semibold text-sm">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="w-11 h-11 flex items-center justify-center hover:bg-secondary transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={handleAdd}
                className="flex-1 h-11 rounded-xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                <ShoppingCart className="w-4 h-4" />
                Tambah ke Keranjang
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
