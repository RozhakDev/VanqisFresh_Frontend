import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/stores/cart';
import { useAuthStore } from '@/stores/auth';
import api from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';
import EmptyState from '@/components/shared/EmptyState';
import { Loader2, MapPin, User, Phone, Edit2, ArrowRight } from 'lucide-react';

/**
 * Menyusun langkah akhir checkout sebelum pesanan dibuat.
 *
 * @returns Halaman checkout.
 */
export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const navigate = useNavigate();

  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error("Silakan masuk terlebih dahulu");
      navigate('/login?redirect=/checkout');
    }
  }, [isAuthenticated, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-vanqis-base-text" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-app py-8 md:py-12 max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-vanqis-base-text mb-10 pb-6 border-b border-vanqis-base-soft">
          Penyelesaian Pesanan
        </h1>
        <EmptyState title="Keranjang Kosong" description="Silakan tambahkan produk ke keranjang terlebih dahulu sebelum melakukan checkout." />
      </div>
    );
  }

  /**
   * Mengirim data checkout ke server untuk membuat pesanan baru.
   */
  const handleCheckout = async () => {
    setLoading(true);
    try {
      const payload = {
        note: note || undefined,
        items: items.map(i => ({ product_id: i.product.id, quantity: i.quantity })),
      };

      const response = await api.post('/orders/checkout/', payload);
      const order = response.data;
      
      toast.success("Pesanan berhasil dibuat!");
      clearCart();
      navigate(`/payment/${order.public_id}`);
    } catch (err: any) {
      const message = err.response?.data?.items?.[0]?.product_id?.[0] || 'Gagal membuat pesanan';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-app py-8 md:py-12 max-w-6xl mx-auto">
      {/* Ringkasan Atas */}
      <div className="mb-10 pb-6 border-b border-vanqis-base-soft">
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-vanqis-base-text leading-none">
          Penyelesaian Pesanan
        </h1>
        <p className="text-[10px] font-bold uppercase tracking-widest text-vanqis-base-text/50 mt-2">
          Tahap Akhir
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
        
        {/* Detail Pengiriman */}
        <div className="lg:col-span-7 space-y-10">
          
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-black uppercase tracking-widest text-vanqis-base-text flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Informasi Pengiriman
              </h2>
              <button onClick={() => navigate('/profile')} className="text-[10px] font-bold uppercase tracking-widest text-vanqis-base-text/60 hover:text-vanqis-fresh-carrot transition-colors flex items-center gap-1 outline-none">
                <Edit2 className="w-3 h-3" /> Ubah
              </button>
            </div>
            
            <div className="bg-vanqis-base-white border border-vanqis-base-soft p-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-vanqis-base-text/50 mb-1 flex items-center gap-1.5"><User className="w-3 h-3" /> Penerima</span>
                    <p className="font-bold text-sm text-vanqis-base-text">{user?.first_name} {user?.last_name}</p>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-vanqis-base-text/50 mb-1 flex items-center gap-1.5"><Phone className="w-3 h-3" /> Nomor WhatsApp</span>
                    <p className="font-bold text-sm text-vanqis-base-text">{user?.phone_number}</p>
                  </div>
                </div>
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-vanqis-base-text/50 mb-1">Alamat Lengkap</span>
                  <p className="text-sm leading-relaxed text-vanqis-base-text/80">{user?.address}</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-sm font-black uppercase tracking-widest text-vanqis-base-text mb-4">
              Catatan Pesanan (Opsional)
            </h2>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Contoh: Tolong kirim sore hari, letakkan di teras..."
              className="w-full min-h-[120px] resize-y bg-vanqis-base-white border border-vanqis-base-soft p-5 text-sm text-vanqis-base-text placeholder:text-vanqis-base-text/40 focus:outline-none focus:border-vanqis-base-text transition-colors"
              maxLength={500}
            />
          </section>

        </div>

        {/* Ringkasan Pesanan */}
        <div className="lg:col-span-5">
          <div className="bg-vanqis-base-white border border-vanqis-base-text p-8 sticky top-24">
            <h2 className="text-xl font-black uppercase tracking-tight text-vanqis-base-text mb-8 pb-4 border-b border-vanqis-base-soft">
              Ringkasan Pesanan
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
                <span className="text-[10px] font-bold uppercase tracking-widest text-vanqis-base-text/70">Total Bayar</span>
                <span className="text-2xl font-black text-vanqis-base-text tracking-tight leading-none">
                  {formatPrice(totalPrice())}
                </span>
              </div>
            </div>
            
            <button
              onClick={handleCheckout} 
              disabled={loading}
              className="flex items-center justify-center w-full h-14 bg-vanqis-base-text text-vanqis-base-white font-bold uppercase tracking-widest text-xs hover:bg-vanqis-fresh-carrot transition-all outline-none disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Memproses...
                </>
              ) : (
                <>
                  Konfirmasi & Buat Pesanan
                  <ArrowRight className="w-4 h-4 ml-3" strokeWidth={2} />
                </>
              )}
            </button>
            <p className="text-[9px] font-bold uppercase tracking-widest text-vanqis-base-text/40 text-center mt-4">
              Anda akan diarahkan ke halaman pembayaran
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
