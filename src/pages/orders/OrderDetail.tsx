import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { formatPrice, cn } from "@/lib/utils";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { 
  Loader2, 
  MapPin, 
  Phone, 
  User, 
  Calendar, 
  ArrowLeft,
  FileText,
  CreditCard,
  Image as ImageIcon,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { OrderDetail, OrderStatus } from "@/types";

const getStatusConfig = (status: OrderStatus) => {
  switch (status) {
    case 'Pending':
      return { color: 'text-vanqis-fresh-tomato border-vanqis-fresh-tomato bg-vanqis-fresh-tomato/5' };
    case 'Confirmed':
      return { color: 'text-vanqis-fresh-carrot border-vanqis-fresh-carrot bg-vanqis-fresh-carrot/5' };
    case 'Preparing':
      return { color: 'text-vanqis-fresh-grape border-vanqis-fresh-grape bg-vanqis-fresh-grape/5' };
    case 'Processing':
      return { color: 'text-vanqis-fresh-banana border-vanqis-fresh-banana bg-vanqis-fresh-banana/5' };
    case 'Shipping':
      return { color: 'text-vanqis-fresh-carrot border-vanqis-fresh-carrot bg-vanqis-fresh-carrot/5' };
    case 'Completed':
      return { color: 'text-vanqis-core-green border-vanqis-core-green bg-vanqis-core-green/5' };
    default:
      return { color: 'text-vanqis-base-text border-vanqis-base-text bg-vanqis-base-text/5' };
  }
};

const OrderStatusPage = () => {
  const { publicId } = useParams();
  const navigate = useNavigate();

  const { data: order, isLoading, error } = useQuery<OrderDetail>({
    queryKey: ["order", publicId],
    queryFn: async () => {
      const response = await api.get(`/orders/${publicId}/`);
      return response.data;
    },
    enabled: !!publicId,
  });

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-vanqis-base-text" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container-app py-24 flex flex-col items-center justify-center text-center border border-vanqis-base-soft bg-vanqis-base-white/50 max-w-3xl mx-auto mt-12">
        <div className="w-20 h-20 bg-vanqis-base-soft flex items-center justify-center mb-8">
          <FileText className="w-8 h-8 text-vanqis-base-text/40" strokeWidth={1} />
        </div>
        <h2 className="font-black text-2xl uppercase tracking-tight text-vanqis-base-text mb-3">Pesanan Tidak Ditemukan</h2>
        <p className="text-sm font-medium text-vanqis-base-text/60 mb-8 max-w-sm leading-relaxed">Maaf, kami tidak dapat menemukan informasi untuk pesanan ini.</p>
        <button 
          onClick={() => navigate("/orders")}
          className="h-12 px-8 bg-vanqis-base-text text-vanqis-base-white font-bold uppercase tracking-widest text-xs flex items-center justify-center hover:bg-vanqis-fresh-carrot transition-colors outline-none"
        >
          Kembali ke Riwayat
        </button>
      </div>
    );
  }

  const statusConfig = getStatusConfig(order.status);

  return (
    <div className="container-app py-8 md:py-12 max-w-5xl mx-auto relative">
      <button 
        className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-vanqis-base-text/60 hover:text-vanqis-base-text transition-colors mb-10 outline-none"
        onClick={() => navigate("/orders")}
      >
        <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
        Kembali ke Riwayat
      </button>

      <div className="mb-10 pb-6 border-b border-vanqis-base-soft flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-vanqis-base-text leading-none mb-2">
            Detail Pesanan
          </h1>
          <p className="text-[10px] font-bold font-mono uppercase tracking-widest text-vanqis-base-text/50">
            ID: {order.public_id}
          </p>
        </div>
        <div className={cn(
          "px-4 py-2 border-2 inline-block font-black text-xs uppercase tracking-widest",
          statusConfig.color
        )}>
          Status: {order.status}
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
        
        <div className="lg:col-span-7 space-y-10">
          
          <section>
            <h2 className="text-sm font-black uppercase tracking-widest text-vanqis-base-text mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4" /> Rincian Produk
            </h2>
            <div className="border border-vanqis-base-soft bg-vanqis-base-white p-6">
              <div className="space-y-4 mb-6">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start pb-4 border-b border-vanqis-base-soft last:border-0 last:pb-0">
                    <div className="space-y-1">
                      <p className="font-bold text-sm text-vanqis-base-text">{item.product_name}</p>
                      <p className="text-xs font-medium text-vanqis-base-text/60">{item.quantity} x {formatPrice(item.price)}</p>
                    </div>
                    <p className="font-black text-sm text-vanqis-base-text">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t-2 border-vanqis-base-text flex justify-between items-end">
                <span className="text-[10px] font-bold uppercase tracking-widest text-vanqis-base-text/70">Total Bayar</span>
                <span className="text-2xl font-black text-vanqis-base-text tracking-tight leading-none">
                  {formatPrice(order.total_price)}
                </span>
              </div>
            </div>
          </section>

          {order.status === 'Pending' && order.payment_proof === 'Belum diunggah' && (
            <section>
               <div className="border-2 border-dashed border-vanqis-fresh-carrot bg-vanqis-fresh-carrot/5 p-8 text-center flex flex-col items-center">
                <div className="w-12 h-12 bg-vanqis-fresh-carrot text-vanqis-base-white flex items-center justify-center mb-4">
                  <ImageIcon className="w-6 h-6" strokeWidth={1.5} />
                </div>
                <h3 className="font-black text-lg uppercase tracking-tight text-vanqis-base-text mb-2">
                  Konfirmasi Pembayaran
                </h3>
                <p className="text-sm font-medium text-vanqis-base-text/70 mb-6 max-w-sm leading-relaxed">
                  Pesanan Anda sudah diterima. Silakan unggah bukti transfer agar kami dapat segera memprosesnya.
                </p>
                <button 
                  onClick={() => navigate(`/payment/${order.public_id}`)}
                  className="flex items-center justify-center h-12 px-8 bg-vanqis-fresh-carrot text-vanqis-base-white font-bold uppercase tracking-widest text-xs hover:bg-vanqis-base-text transition-colors outline-none"
                >
                  Unggah Bukti Sekarang
                </button>
              </div>
            </section>
          )}

          {order.payment_proof !== 'Belum diunggah' && (
            <section>
              <h2 className="text-sm font-black uppercase tracking-widest text-vanqis-base-text mb-4 flex items-center gap-2">
                <CreditCard className="w-4 h-4" /> Status Pembayaran
              </h2>
              <div className="border border-vanqis-base-soft bg-vanqis-base-white p-6 flex items-start gap-4">
                <div className="w-10 h-10 bg-vanqis-core-green/10 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-vanqis-core-green" strokeWidth={2} />
                </div>
                <div>
                  <p className="font-bold text-sm text-vanqis-base-text uppercase tracking-wide mb-1">Bukti Terunggah</p>
                  <p className="text-xs font-medium text-vanqis-base-text/60 leading-relaxed">
                    Terima kasih. Bukti pembayaran Anda telah kami terima dan sedang menunggu verifikasi oleh admin.
                  </p>
                </div>
              </div>
            </section>
          )}

        </div>

        <div className="lg:col-span-5 space-y-10">
          
          <section>
            <h2 className="text-sm font-black uppercase tracking-widest text-vanqis-base-text mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Informasi Transaksi
            </h2>
            <div className="border border-vanqis-base-soft bg-vanqis-base-white p-6 space-y-5">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-vanqis-base-text/50 mb-1 block">Waktu Pesanan</span>
                <p className="font-bold text-sm text-vanqis-base-text">
                  {format(new Date(order.created_at), "d MMMM yyyy, HH:mm", { locale: id })}
                </p>
              </div>
              <div className="pt-5 border-t border-vanqis-base-soft">
                <span className="text-[9px] font-bold uppercase tracking-widest text-vanqis-base-text/50 mb-1 block">Metode</span>
                <p className="font-bold text-sm text-vanqis-base-text uppercase">Transfer Manual / QRIS</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-sm font-black uppercase tracking-widest text-vanqis-base-text mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Detail Pengiriman
            </h2>
            <div className="border border-vanqis-base-soft bg-vanqis-base-white p-6 space-y-5">
              <div className="flex gap-4">
                <User className="w-4 h-4 text-vanqis-base-text/40 mt-0.5 shrink-0" />
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-vanqis-base-text/50 mb-0.5 block">Penerima</span>
                  <p className="font-bold text-sm text-vanqis-base-text">{order.customer_name}</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Phone className="w-4 h-4 text-vanqis-base-text/40 mt-0.5 shrink-0" />
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-vanqis-base-text/50 mb-0.5 block">Kontak</span>
                  <p className="font-bold text-sm text-vanqis-base-text">{order.customer_contact}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <MapPin className="w-4 h-4 text-vanqis-base-text/40 mt-0.5 shrink-0" />
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-vanqis-base-text/50 mb-0.5 block">Alamat Tujuan</span>
                  <p className="text-sm font-medium text-vanqis-base-text/80 leading-relaxed">{order.shipping_address}</p>
                </div>
              </div>

              {order.note && (
                <div className="pt-5 border-t border-vanqis-base-soft mt-5">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-vanqis-base-text/50 mb-1.5 block">Catatan Pesanan</span>
                  <div className="bg-vanqis-base-soft/30 p-4 border-l-2 border-vanqis-base-text">
                    <p className="text-sm font-medium italic text-vanqis-base-text/80">"{order.note}"</p>
                  </div>
                </div>
              )}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default OrderStatusPage;
