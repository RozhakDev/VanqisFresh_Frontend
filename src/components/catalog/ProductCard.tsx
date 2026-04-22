import { Link } from 'react-router-dom';
import { Plus, Package } from 'lucide-react';
import type { Product } from '@/types';
import { formatPrice, cn } from '@/lib/utils';
import { useCart } from '@/stores/cart';
import { toast } from 'sonner';

interface Props {
  product: Product;
}

/**
 * Menampilkan kartu produk dengan aksi cepat tambah ke keranjang.
 *
 * @param product - Data produk yang akan dirender.
 * @returns Kartu produk yang dapat diklik.
 */
export default function ProductCard({ product }: Props) {
  const addItem = useCart(s => s.addItem);

  /**
   * Menangani aksi tambah produk tanpa membuka halaman detail.
   *
   * @param e - Event klik pada tombol aksi cepat.
   */
  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.is_available || product.stock <= 0) return;
    addItem(product, 1);
    toast.success('Ditambahkan ke keranjang', {
      description: product.name,
    });
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="group flex flex-col bg-vanqis-base-white border border-vanqis-base-soft hover:border-vanqis-base-text transition-colors duration-300 relative h-full"
    >
      {/* Gambar */}
      <div className="aspect-[4/3] bg-vanqis-base-soft/50 relative overflow-hidden flex items-center justify-center border-b border-vanqis-base-soft">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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

      {/* Detail */}
      <div className="p-3 sm:p-5 flex flex-col flex-1">
        <h3 className="font-bold text-xs sm:text-sm leading-tight line-clamp-2 mb-3 sm:mb-4 group-hover:text-vanqis-accent transition-colors text-vanqis-base-text">
          {product.name}
        </h3>
        
        <div className="mt-auto flex items-end justify-between gap-1.5 sm:gap-2">
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[9px] sm:text-[10px] font-medium text-vanqis-base-text/50 uppercase tracking-wider mb-0.5">Price</span>
            <p className="font-black text-[11px] sm:text-base text-vanqis-base-text flex flex-wrap items-baseline gap-x-0.5">
              <span className="truncate">{formatPrice(product.price)}</span>
              {product.unit && <span className="text-[8px] sm:text-xs font-medium text-vanqis-base-text/60">/{product.unit}</span>}
            </p>
          </div>
          
          {product.is_available && product.stock > 0 && (
            <button
              onClick={handleAdd}
              className="shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-vanqis-base-white border border-vanqis-base-text text-vanqis-base-text flex items-center justify-center hover:bg-vanqis-base-text hover:text-vanqis-base-white transition-colors"
              aria-label={`Add ${product.name} to cart`}
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.5} />
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
