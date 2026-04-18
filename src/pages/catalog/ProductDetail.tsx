import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProduct } from '@/lib/api';
import { formatPrice, cn } from '@/lib/utils';
import type { Product } from '@/types';
import { useCart } from '@/stores/cart';
import { toast } from 'sonner';
import { DetailSkeleton } from '@/components/shared/LoadingSkeleton';
import { ArrowLeft, Minus, Plus, ShoppingCart, Package, AlertCircle } from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [qty, setQty] = useState(1);
  const addItem = useCart(s => s.addItem);

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
      <div className="container-app py-32 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-vanqis-base-soft flex items-center justify-center mb-6">
          <AlertCircle className="w-10 h-10 text-vanqis-base-text/40" strokeWidth={1} />
        </div>
        <h2 className="font-black text-2xl uppercase tracking-tight text-vanqis-base-text mb-4">Produk Tidak Ditemukan</h2>
        <Link to="/" className="text-xs font-bold uppercase tracking-widest text-vanqis-base-text hover:text-vanqis-fresh-carrot transition-colors border-b border-vanqis-base-text hover:border-vanqis-fresh-carrot pb-0.5">
          Kembali ke Katalog
        </Link>
      </div>
    );
  }

  const handleAdd = () => {
    addItem(product, qty);
    toast.success('Ditambahkan ke keranjang', {
      description: `${qty}x ${product.name}`,
    });
  };

  return (
    <div className="container-app py-8 md:py-12">
      <Link 
        to="/" 
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-vanqis-base-text/60 hover:text-vanqis-base-text transition-colors mb-8 sm:mb-12 outline-none"
      >
        <ArrowLeft className="w-4 h-4" strokeWidth={1.5} /> 
        Kembali ke Katalog
      </Link>

      <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
        
        <div className="lg:col-span-7">
          <div className="aspect-[4/3] sm:aspect-square bg-vanqis-base-soft/30 border border-vanqis-base-soft relative overflow-hidden flex items-center justify-center p-8 group">
            {product.image ? (
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-700" 
              />
            ) : (
              <Package className="w-32 h-32 text-vanqis-base-text/10" strokeWidth={0.5} />
            )}
            
            <span className="absolute top-0 left-0 bg-vanqis-base-text text-vanqis-base-white text-[10px] font-bold uppercase tracking-widest px-4 py-2">
              {product.category_name}
            </span>

            {!product.is_available && (
              <div className="absolute inset-0 bg-vanqis-base-white/80 backdrop-blur-[2px] flex items-center justify-center">
                <span className="border-2 border-vanqis-base-text text-vanqis-base-text text-xs font-black uppercase tracking-[0.3em] px-6 py-3 bg-vanqis-base-white">
                  Sold Out
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col pt-2 lg:pt-8">
          
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter text-vanqis-base-text leading-[1.1] mb-6">
              {product.name}
            </h1>
            <p className="text-3xl font-bold text-vanqis-base-text">
              {formatPrice(product.price)}
            </p>
          </div>

          <div className="w-12 h-1 bg-vanqis-fresh-carrot mb-8" />

          <div className="mb-10 space-y-6">
            <p className="text-sm md:text-base text-vanqis-base-text/70 leading-relaxed font-medium">
              {product.description}
            </p>
          </div>

          <div className="mt-auto pt-8 border-t border-vanqis-base-soft">
            <div className="flex flex-col gap-6">
              
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-2 h-2 rounded-full animate-pulse",
                  product.is_available && product.stock > 0 ? 'bg-vanqis-core-green' : 'bg-vanqis-fresh-tomato'
                )} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-vanqis-base-text">
                  {product.is_available && product.stock > 0
                    ? `Stok Tersedia: ${product.stock}`
                    : 'Stok Habis'}
                </span>
              </div>

              {product.is_available && product.stock > 0 && (
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center border border-vanqis-base-text h-14 bg-vanqis-base-white w-full sm:w-auto shrink-0">
                    <button 
                      onClick={() => setQty(q => Math.max(1, q - 1))} 
                      className="w-14 h-full flex items-center justify-center hover:bg-vanqis-base-soft transition-colors outline-none"
                    >
                      <Minus className="w-4 h-4 text-vanqis-base-text" strokeWidth={1.5} />
                    </button>
                    <span className="w-12 text-center font-black text-vanqis-base-text text-sm">
                      {qty}
                    </span>
                    <button 
                      onClick={() => setQty(q => Math.min(product.stock, q + 1))} 
                      className="w-14 h-full flex items-center justify-center hover:bg-vanqis-base-soft transition-colors outline-none"
                    >
                      <Plus className="w-4 h-4 text-vanqis-base-text" strokeWidth={1.5} />
                    </button>
                  </div>
                  
                  <button
                    onClick={handleAdd}
                    className="flex-1 h-14 bg-vanqis-base-text text-vanqis-base-white font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-vanqis-fresh-carrot transition-colors outline-none"
                  >
                    <ShoppingCart className="w-4 h-4" strokeWidth={2} />
                    Tambah ke Keranjang
                  </button>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
