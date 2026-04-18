import { Link } from 'react-router-dom';
import { useCart } from '@/stores/cart';
import { formatPrice } from '@/lib/utils';
import { Minus, Plus, Trash2, Package, ArrowRight } from 'lucide-react';
import EmptyState from '@/components/EmptyState';

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="container-app py-8 md:py-12 max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-vanqis-base-text mb-10 pb-6 border-b border-vanqis-base-soft">
          Keranjang Saya
        </h1>
        <EmptyState title="Keranjang Kosong" description="Belum ada produk di keranjang Anda. Jelajahi katalog kami untuk menemukan produk segar pilihan." />
      </div>
    );
  }

  return (
    <div className="container-app py-8 md:py-12 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-vanqis-base-soft">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-vanqis-base-text leading-none">
            Keranjang Saya
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-widest text-vanqis-base-text/50 mt-2">
            {items.length} {items.length > 1 ? 'Item' : 'Item'} terpilih
          </p>
        </div>
        <Link 
          to="/" 
          className="hidden sm:inline-flex text-xs font-bold uppercase tracking-widest text-vanqis-base-text hover:text-vanqis-fresh-carrot transition-colors border-b border-vanqis-base-text hover:border-vanqis-fresh-carrot pb-0.5"
        >
          Lanjut Belanja
        </Link>
      </div>

      <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
        
        <div className="lg:col-span-8 flex flex-col gap-6">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="bg-vanqis-base-white border border-vanqis-base-soft flex flex-col sm:flex-row gap-0 sm:gap-6 group relative">
              
              <div className="w-full sm:w-36 h-40 sm:h-auto bg-vanqis-base-soft/30 overflow-hidden shrink-0 flex items-center justify-center p-4 border-b sm:border-b-0 sm:border-r border-vanqis-base-soft relative">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
                ) : (
                  <Package className="w-8 h-8 text-vanqis-base-text/20" strokeWidth={1} />
                )}
                
                <button
                  onClick={() => removeItem(product.id)}
                  className="sm:hidden absolute top-2 right-2 w-8 h-8 bg-vanqis-base-white/90 backdrop-blur-sm border border-vanqis-base-soft flex items-center justify-center text-vanqis-base-text hover:text-vanqis-fresh-tomato hover:border-vanqis-fresh-tomato transition-colors"
                  aria-label="Hapus item"
                >
                  <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </div>

              <div className="flex-1 p-5 sm:py-5 sm:pr-6 flex flex-col justify-center">
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-vanqis-base-text/50">
                      {product.category_name}
                    </p>
                    <Link to={`/product/${product.id}`} className="font-black text-lg uppercase tracking-tight text-vanqis-base-text hover:text-vanqis-fresh-carrot transition-colors line-clamp-2 leading-tight">
                      {product.name}
                    </Link>
                  </div>
                  
                  <button
                    onClick={() => removeItem(product.id)}
                    className="hidden sm:flex p-2 text-vanqis-base-text/30 hover:text-vanqis-fresh-tomato transition-colors"
                    title="Hapus dari keranjang"
                  >
                    <Trash2 className="w-5 h-5" strokeWidth={1.5} />
                  </button>
                </div>
                
                <div className="flex flex-row items-end sm:items-center justify-between mt-auto">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-vanqis-base-text/50 mb-0.5">Harga</span>
                    <p className="font-bold text-base text-vanqis-base-text">{formatPrice(product.price)}</p>
                  </div>
                  
                  <div className="flex items-center border border-vanqis-base-text h-10 bg-vanqis-base-white shrink-0">
                    <button 
                      onClick={() => updateQuantity(product.id, quantity - 1)} 
                      className="w-10 h-full flex items-center justify-center hover:bg-vanqis-base-soft transition-colors outline-none"
                    >
                      <Minus className="w-3 h-3 text-vanqis-base-text" strokeWidth={1.5} />
                    </button>
                    <span className="w-10 text-center font-black text-vanqis-base-text text-sm">
                      {quantity}
                    </span>
                    <button 
                      onClick={() => updateQuantity(product.id, quantity + 1)} 
                      className="w-10 h-full flex items-center justify-center hover:bg-vanqis-base-soft transition-colors outline-none"
                    >
                      <Plus className="w-3 h-3 text-vanqis-base-text" strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <div className="sm:hidden mt-4">
            <Link 
              to="/" 
              className="text-[10px] font-bold uppercase tracking-widest text-vanqis-base-text hover:text-vanqis-fresh-carrot transition-colors"
            >
              ← Kembali Belanja
            </Link>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-vanqis-base-white border border-vanqis-base-text p-8 sticky top-24">
            <h2 className="text-xl font-black uppercase tracking-tight text-vanqis-base-text mb-8 pb-4 border-b border-vanqis-base-soft">
              Ringkasan
            </h2>
            
            <div className="space-y-4 text-sm mb-8 font-medium">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex justify-between items-start gap-4">
                  <span className="text-vanqis-base-text/70 line-clamp-2">
                    {product.name} <span className="text-vanqis-base-text font-bold">x{quantity}</span>
                  </span>
                  <span className="shrink-0 text-vanqis-base-text font-bold">
                    {formatPrice(product.price * quantity)}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="border-t border-vanqis-base-text pt-6 flex flex-col gap-2 mb-8">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-bold uppercase tracking-widest text-vanqis-base-text/70">Total Pembayaran</span>
                <span className="text-2xl font-black text-vanqis-base-text tracking-tight leading-none">
                  {formatPrice(totalPrice())}
                </span>
              </div>
              <p className="text-[10px] text-vanqis-base-text/50 font-medium italic text-right">
                *Belum termasuk ongkos kirim
              </p>
            </div>
            
            <Link
              to="/checkout"
              className="flex items-center justify-center w-full h-14 bg-vanqis-base-text text-vanqis-base-white font-bold uppercase tracking-widest text-xs hover:bg-vanqis-fresh-carrot transition-all outline-none group"
            >
              Lanjut Checkout
              <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
