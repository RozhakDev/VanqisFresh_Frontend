import { Link } from 'react-router-dom';
import { Plus, Package } from 'lucide-react';
import type { Product } from '@/types';
import { formatPrice } from '@/lib/api';
import { useCart } from '@/stores/cart';
import { useToast } from '@/hooks/use-toast';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const addItem = useCart(s => s.addItem);
  const { toast } = useToast();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.is_available || product.stock <= 0) return;
    addItem(product, 1);
    toast({ title: 'Ditambahkan ke keranjang', description: product.name });
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="group bg-card rounded-2xl border overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      <div className="aspect-square bg-secondary relative overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-12 h-12 text-muted-foreground/40" />
          </div>
        )}
        {!product.is_available && (
          <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
            <span className="bg-card text-foreground text-xs font-semibold px-3 py-1 rounded-full">Habis</span>
          </div>
        )}
        <span className="absolute top-3 left-3 text-[11px] font-medium bg-card/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-muted-foreground">
          {product.category_name}
        </span>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-sm leading-snug line-clamp-2 mb-2 group-hover:text-accent-foreground transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <p className="font-bold text-base">{formatPrice(product.price)}</p>
          {product.is_available && product.stock > 0 && (
            <button
              onClick={handleAdd}
              className="w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity"
              aria-label={`Tambah ${product.name}`}
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
