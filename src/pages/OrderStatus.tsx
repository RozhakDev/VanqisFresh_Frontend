import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrder, formatPrice } from '@/lib/api';
import type { OrderResponse } from '@/types';
import { Loader2, Package, CheckCircle2, Clock, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';

export default function OrderStatus() {
  const { publicId } = useParams<{ publicId: string }>();
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!publicId) return;
      
      const accessToken = localStorage.getItem(`order_token_${publicId}`);
      console.log('Fetching order:', publicId, 'with token:', accessToken);

      if (!accessToken) {
        setError('Token akses tidak ditemukan. Pastikan Anda mengakses dari link yang benar.');
        setLoading(false);
        return;
      }

      try {
        const data = await getOrder(publicId, accessToken);
        setOrder(data);
      } catch (err: any) {
        console.error('API Error in OrderStatus:', err);
        const detail = err.response?.data?.detail;
        const status = err.response?.status;
        const message = err.message;
        
        if (status === 404) {
          setError('Pesanan tidak ditemukan atau token tidak valid.');
        } else {
          setError(detail || message || 'Gagal mengambil detail pesanan.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [publicId]);

  if (loading) {
    return (
      <div className="container-app py-20 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Memuat detail pesanan...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container-app py-20 text-center">
        <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Terjadi Kesalahan</h2>
        <p className="text-muted-foreground mb-6">{error || 'Pesanan tidak ditemukan.'}</p>
        <Link to="/" className="inline-flex items-center gap-2 text-primary hover:underline">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
        </Link>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return <Clock className="w-5 h-5 text-warning" />;
      case 'Confirmed': return <CheckCircle2 className="w-5 h-5 text-success" />;
      case 'Completed': return <CheckCircle className="w-5 h-5 text-primary" />;
      default: return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'Pending': return 'Menunggu Verifikasi';
      case 'Confirmed': return 'Pesanan Dikonfirmasi';
      case 'Completed': return 'Pesanan Selesai';
      default: return status;
    }
  };

  return (
    <div className="container-app py-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/" className="p-2 rounded-xl bg-secondary hover:bg-border transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold">Status Pesanan</h1>
      </div>

      <div className="grid gap-6">
        {/* Status Header */}
        <div className="bg-card rounded-2xl border p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              order.status === 'Pending' ? 'bg-warning/10 text-warning' : 
              order.status === 'Confirmed' ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'
            }`}>
              {getStatusIcon(order.status)}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status Saat Ini</p>
              <p className="font-bold">{getStatusLabel(order.status)}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Order ID</p>
            <p className="font-mono text-xs">{order.public_id.slice(0, 8)}...</p>
          </div>
        </div>

        {/* Action Call for Upload Proof */}
        {order.status === 'Pending' && order.payment_proof === 'Belum diunggah' && (
          <div className="bg-accent/50 rounded-2xl border border-primary/20 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-bold text-accent-foreground">Bukti Pembayaran Belum Ada</p>
              <p className="text-sm text-muted-foreground">Silakan upload bukti transfer agar pesanan segera diproses.</p>
            </div>
            <Link 
              to={`/payment/${order.public_id}`} 
              state={{ accessToken: localStorage.getItem(`order_token_${order.public_id}`), order }}
              className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity shrink-0"
            >
              Upload Sekarang
            </Link>
          </div>
        )}

        {/* Order Details */}
        <div className="bg-card rounded-2xl border p-6 space-y-4">
          <h2 className="font-bold flex items-center gap-2">
            <Package className="w-4 h-4" /> Detail Pesanan
          </h2>
          
          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{item.product_name} x{item.quantity}</span>
                <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 flex justify-between font-bold text-lg">
            <span>Total Bayar</span>
            <span className="text-primary">{formatPrice(order.total_price)}</span>
          </div>
        </div>

        {/* Customer Info */}
        <div className="bg-card rounded-2xl border p-6 space-y-4">
          <h2 className="font-bold">Informasi Pengiriman</h2>
          <div className="grid gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nama Pemesan</span>
              <span className="font-medium">{order.customer_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Kontak</span>
              <span className="font-medium">{order.customer_contact}</span>
            </div>
            {order.note && (
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground">Catatan</span>
                <span className="p-3 bg-secondary rounded-lg italic">{order.note}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="text-center text-xs text-muted-foreground">
          Dipesan pada {new Date(order.created_at).toLocaleString('id-ID', { 
            dateStyle: 'long', 
            timeStyle: 'short' 
          })}
        </div>
      </div>
    </div>
  );
}
