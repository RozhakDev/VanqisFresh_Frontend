import { Link } from 'react-router-dom';
import { Plus, Package } from 'lucide-react';
import type { Product } from '@/types';
import { formatPrice, cn } from '@/lib/utils';
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
      className="group flex flex-col bg-vanqis-base-white border border-vanqis-base-soft hover:border-vanqis-base-text transition-colors duration-300 relative h-full"
    >
      <div className="aspect-[4/3] bg-vanqis-base-soft/50 relative overflow-hidden flex items-center justify-center border-b border-vanqis-base-soft p-4">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <Package className="w-10 h-10 text-vanqis-base-text/20" strokeWidth={1} />
        )}
        
        <span className="absolute top-0 left-0 bg-vanqis-base-white border-b border-r border-vanqis-base-soft text-[9px] font-bold uppercase tracking-widest px-2 py-1 text-vanqis-base-text/70">
          {product.category_name}
        </span>

        {!product.is_available && (
          <div className="absolute inset-0 bg-vanqis-base-white/80 backdrop-blur-[2px] flex items-center justify-center">
            <span className="border border-vanqis-base-text text-vanqis-base-text text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-vanqis-base-white">
              Sold Out
            </span>
          </div>
        )}
      </div>

      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <h3 className="font-bold text-sm leading-tight line-clamp-2 mb-4 group-hover:text-vanqis-fresh-carrot transition-colors text-vanqis-base-text">
          {product.name}
        </h3>
        
        <div className="mt-auto flex items-end justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-[10px] font-medium text-vanqis-base-text/50 uppercase tracking-wider mb-0.5">Price</span>
            <p className="font-black text-base text-vanqis-base-text">{formatPrice(product.price)}</p>
          </div>
          
          {product.is_available && product.stock > 0 && (
            <button
              onClick={handleAdd}
              className="shrink-0 w-10 h-10 bg-vanqis-base-white border border-vanqis-base-text text-vanqis-base-text flex items-center justify-center hover:bg-vanqis-base-text hover:text-vanqis-base-white transition-colors"
              aria-label={`Add ${product.name} to cart`}
            >
              <Plus className="w-5 h-5" strokeWidth={1.5} />
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
