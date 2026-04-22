import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/stores/cart';
import { useAuthStore } from '@/stores/auth';
import api, { getStoreContacts } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';
import EmptyState from '@/components/shared/EmptyState';
import { Loader2 } from 'lucide-react';
import DeliveryInfo from '@/components/checkout/DeliveryInfo';
import CheckoutMethodSelector from '@/components/checkout/CheckoutMethodSelector';
import OrderSummary from '@/components/checkout/OrderSummary';

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
  const [checkoutMethod, setCheckoutMethod] = useState<'whatsapp' | 'manual'>('whatsapp');
  const [waNumber, setWaNumber] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error("Silakan masuk terlebih dahulu");
      navigate('/login?redirect=/checkout');
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const responseData = await getStoreContacts();
        const contacts = Array.isArray(responseData) ? responseData : responseData?.results || [];
        
        const waContact = contacts.find((c: any) => c.platform?.toLowerCase() === 'whatsapp');
        if (waContact) {
          setWaNumber(waContact.account_id);
        }
      } catch (error) {
        console.error("Failed to fetch store contacts", error);
      }
    };
    fetchContacts();
  }, []);

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
   * Memproses checkout WhatsApp dengan generate pesan.
   */
  const handleWhatsAppCheckout = () => {
    if (!waNumber) {
      toast.error("Nomor WhatsApp admin tidak ditemukan. Silakan coba metode Transfer Manual.");
      return;
    }

    const formattedItems = items.map((item, index) => 
      `${index + 1}. ${item.product.name}\n   Jumlah: ${item.quantity}\n   Harga: ${formatPrice(item.product.price)}\n   Subtotal: ${formatPrice(item.product.price * item.quantity)}`
    ).join('\n\n');

    const total = formatPrice(totalPrice());
    const customerInfo = `*Informasi Penerima:*\nNama: ${user?.first_name} ${user?.last_name || ''}\nNo. WhatsApp: ${user?.phone_number}\nAlamat: ${user?.address}`;
    const userNote = note ? `\n*Catatan:* ${note}` : '';

    const message = `Halo VanqisFresh, saya ingin memesan:\n\n${formattedItems}\n\n*Total Pesanan: ${total}*\n\n${customerInfo}${userNote}`;
    
    const encodedMessage = encodeURIComponent(message);
    const waUrl = `https://wa.me/${waNumber}?text=${encodedMessage}`;

    toast.success("Mengarahkan ke WhatsApp...");
    clearCart();
    
    window.open(waUrl, '_blank');
    navigate('/');
  };

  /**
   * Mengirim data checkout ke server untuk metode manual.
   */
  const handleManualCheckout = async () => {
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

  const handleCheckout = () => {
    if (checkoutMethod === 'whatsapp') {
      handleWhatsAppCheckout();
    } else {
      handleManualCheckout();
    }
  };

  return (
    <div className="container-app py-8 md:py-12 max-w-6xl mx-auto">
      {/* Header Halaman */}
      <div className="mb-10 pb-6 border-b border-vanqis-base-soft">
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-vanqis-base-text leading-none">
          Penyelesaian Pesanan
        </h1>
        <p className="text-[10px] font-bold uppercase tracking-widest text-vanqis-base-text/50 mt-2">
          Tahap Akhir
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
        
        {/* Kolom Kiri */}
        <div className="lg:col-span-7 space-y-10">
          
          <DeliveryInfo user={user} />

          <CheckoutMethodSelector method={checkoutMethod} onSelect={setCheckoutMethod} />

          {/* Form Catatan */}
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

        {/* Kolom Kanan */}
        <div className="lg:col-span-5">
          <OrderSummary 
            items={items}
            total={totalPrice()}
            method={checkoutMethod}
            onCheckout={handleCheckout}
            loading={loading}
            disabled={loading || (checkoutMethod === 'whatsapp' && !waNumber)}
          />
        </div>

      </div>
    </div>
  );
}
