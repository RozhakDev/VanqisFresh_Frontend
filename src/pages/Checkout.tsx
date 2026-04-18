import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/stores/cart';
import { useAuthStore } from '@/stores/auth';
import api from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';
import EmptyState from '@/components/EmptyState';
import { Loader2, CreditCard, MapPin, User, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const navigate = useNavigate();

  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error("Silakan login terlebih dahulu");
      navigate('/login?redirect=/checkout');
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const response = await api.get('/core/payments/');
        setPaymentMethods(response.data.results || response.data);
      } catch (err) {
        console.error('Failed to fetch payment methods:', err);
      }
    };
    if (isAuthenticated) fetchPaymentMethods();
  }, [isAuthenticated]);

  if (authLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-app py-10">
        <EmptyState title="Keranjang kosong" description="Tambahkan produk terlebih dahulu" />
      </div>
    );
  }

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
    <div className="container-app py-6 max-w-6xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Alamat Pengiriman (Otomatis dari Profil) */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Informasi Pengiriman
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <User className="w-4 h-4 mt-1 text-muted-foreground" />
                <div>
                  <p className="font-semibold">{user?.first_name} {user?.last_name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <Phone className="w-4 h-4 mt-1 text-muted-foreground" />
                <div>
                  <p className="text-sm">{user?.phone_number}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <MapPin className="w-4 h-4 mt-1 text-muted-foreground" />
                <div>
                  <p className="text-sm leading-relaxed">{user?.address}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground italic">
                * Data diambil dari profil Anda. Untuk mengubahnya, silakan update profil di menu Akun.
              </p>
            </CardContent>
          </Card>

          {/* Catatan Pesanan */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Catatan Tambahan (Opsional)</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Contoh: Tolong kirim sore hari ya..."
                className="min-h-[100px] resize-none"
                maxLength={500}
              />
            </CardContent>
          </Card>

          {/* Info Pembayaran */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                Metode Pembayaran Transfer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground mb-4">
                Silakan lakukan transfer ke salah satu rekening berikut setelah membuat pesanan:
              </p>
              {paymentMethods.map((pm: any) => (
                <div key={pm.id} className="flex items-center gap-4 p-4 rounded-xl border bg-card">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-primary font-bold">
                    {pm.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold">{pm.name}</p>
                    <p className="text-sm font-mono text-muted-foreground">{pm.account_number}</p>
                    <p className="text-xs text-muted-foreground">a.n {pm.account_name}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Ringkasan Pesanan */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Ringkasan Belanja</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground line-clamp-1">{product.name} x{quantity}</span>
                    <span className="font-medium">{formatPrice(product.price * quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total Harga</span>
                  <span className="text-primary">{formatPrice(totalPrice())}</span>
                </div>
              </div>
              <Button 
                onClick={handleCheckout} 
                className="w-full h-12 text-lg font-bold" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Memproses...
                  </>
                ) : "Buat Pesanan Sekarang"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
