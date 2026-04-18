import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/stores/cart';
import { formatPrice, createOrder, getPaymentMethods, getStoreContacts } from '@/lib/api';
import type { PaymentMethod, StoreContact } from '@/types';
import { useToast } from '@/hooks/use-toast';
import EmptyState from '@/components/EmptyState';
import { Loader2, MessageCircle, CreditCard } from 'lucide-react';
import { z } from 'zod';

const checkoutSchema = z.object({
  customer_name: z.string().trim().min(1, 'Nama wajib diisi').max(150),
  customer_contact: z.string().trim().min(1, 'Nomor kontak wajib diisi').max(20).regex(/^[0-9+\-\s]+$/, 'Nomor kontak tidak valid'),
  note: z.string().max(500).optional(),
});

export default function Checkout() {
  console.log('Checkout rendering...');
  const { items, totalPrice, clearCart } = useCart();
  console.log('Cart items:', items);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [note, setNote] = useState('');
  const [method, setMethod] = useState<'whatsapp' | 'transfer'>('transfer');
  const [loading, setLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [contacts, setContacts] = useState<StoreContact[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [methodsData, contactsData] = await Promise.all([
          getPaymentMethods(),
          getStoreContacts()
        ]);
        
        // Handle potential paginated responses or direct arrays
        const methodsArr = Array.isArray(methodsData) ? methodsData : (methodsData as any)?.results || [];
        const contactsArr = Array.isArray(contactsData) ? contactsData : (contactsData as any)?.results || [];
        
        setPaymentMethods(methodsArr);
        setContacts(contactsArr);
      } catch (err) {
        console.error('Failed to fetch checkout data:', err);
      }
    };
    fetchData();
  }, []);

  if (items.length === 0) {
    return (
      <div className="container-app py-6">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>
        <EmptyState title="Keranjang kosong" description="Tambahkan produk terlebih dahulu" />
      </div>
    );
  }

  // Ensure contacts is an array before calling .find()
  const whatsappContact = Array.isArray(contacts) ? contacts.find(c => c.platform === 'whatsapp') : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = checkoutSchema.safeParse({ customer_name: name, customer_contact: contact, note });
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach(err => {
        const field = err.path[0] as string;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    if (method === 'whatsapp') {
      const lines = [
        `Halo, saya ingin memesan:`,
        '',
        ...items.map(i => `• ${i.product.name} x${i.quantity} = ${formatPrice(i.product.price * i.quantity)}`),
        '',
        `Total: ${formatPrice(totalPrice())}`,
        '',
        `Nama: ${name}`,
        `Kontak: ${contact}`,
        note ? `Catatan: ${note}` : '',
      ].filter(Boolean).join('\n');

      const waNumber = whatsappContact?.account_id || '';
      const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(lines)}`;
      window.open(url, '_blank');
      clearCart();
      navigate('/');
      toast({ title: 'Pesanan dikirim via WhatsApp' });
      return;
    }

    setLoading(true);
    try {
      const order = await createOrder({
        customer_name: name,
        customer_contact: contact,
        note: note || undefined,
        items: items.map(i => ({ product_id: i.product.id, quantity: i.quantity })),
      });
      
      // Store token for later access (Order Status & Payment Upload)
      localStorage.setItem(`order_token_${order.public_id}`, order.access_token);
      
      clearCart();
      navigate(`/order/${order.public_id}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal membuat pesanan';
      toast({ title: 'Error', description: message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-app py-6">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-2xl border p-6 space-y-4">
            <h2 className="font-bold">Informasi Pemesan</h2>
            <div>
              <label className="text-sm font-medium mb-1 block">Nama *</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-secondary text-sm border-0 focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Nama lengkap"
                maxLength={150}
              />
              {errors.customer_name && <p className="text-xs text-destructive mt-1">{errors.customer_name}</p>}
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Nomor Kontak / WhatsApp *</label>
              <input
                type="text"
                value={contact}
                onChange={e => setContact(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-secondary text-sm border-0 focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="081234567890"
                maxLength={20}
              />
              {errors.customer_contact && <p className="text-xs text-destructive mt-1">{errors.customer_contact}</p>}
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Catatan (opsional)</label>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                className="w-full h-24 px-4 py-3 rounded-xl bg-secondary text-sm border-0 resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Catatan tambahan untuk pesanan"
                maxLength={500}
              />
            </div>
          </div>

          <div className="bg-card rounded-2xl border p-6 space-y-4">
            <h2 className="font-bold">Metode Pemesanan</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMethod('transfer')}
                className={`p-4 rounded-xl border-2 text-left transition-colors ${
                  method === 'transfer' ? 'border-primary bg-accent' : 'border-border hover:border-muted-foreground/30'
                }`}
              >
                <CreditCard className="w-5 h-5 mb-2 text-accent-foreground" />
                <p className="font-semibold text-sm">Transfer Manual</p>
                <p className="text-xs text-muted-foreground">QRIS / Bank / E-Wallet</p>
              </button>
              <button
                type="button"
                onClick={() => setMethod('whatsapp')}
                className={`p-4 rounded-xl border-2 text-left transition-colors ${
                  method === 'whatsapp' ? 'border-primary bg-accent' : 'border-border hover:border-muted-foreground/30'
                }`}
              >
                <MessageCircle className="w-5 h-5 mb-2 text-accent-foreground" />
                <p className="font-semibold text-sm">Via WhatsApp</p>
                <p className="text-xs text-muted-foreground">Pesan langsung ke admin</p>
              </button>
            </div>
          </div>

          {method === 'transfer' && paymentMethods.length > 0 && (
            <div className="bg-card rounded-2xl border p-6 space-y-3">
              <h2 className="font-bold">Metode Pembayaran Tersedia</h2>
              {paymentMethods.map(pm => (
                <div key={pm.id} className="flex items-center gap-3 p-3 rounded-xl bg-secondary">
                  <div className="w-10 h-10 rounded-lg bg-card flex items-center justify-center shrink-0 text-xs font-bold uppercase text-accent-foreground">
                    {pm.provider_type === 'qris' ? 'QR' : pm.name.slice(0, 2)}
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold">{pm.name}</p>
                    {pm.account_number && (
                      <p className="text-muted-foreground">{pm.account_number} — {pm.account_name}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {method === 'whatsapp' ? 'Kirim via WhatsApp' : 'Buat Pesanan'}
          </button>
        </form>

        <div className="lg:col-span-1">
          <div className="bg-card rounded-2xl border p-6 sticky top-24">
            <h2 className="font-bold mb-4">Ringkasan Pesanan</h2>
            <div className="space-y-2 text-sm mb-6">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex justify-between text-muted-foreground">
                  <span className="truncate mr-2">{product.name} x{quantity}</span>
                  <span className="shrink-0">{formatPrice(product.price * quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 flex justify-between font-bold">
              <span>Total</span>
              <span>{formatPrice(totalPrice())}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
