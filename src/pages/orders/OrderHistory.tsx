import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { formatPrice, cn } from "@/lib/utils";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { 
  Loader2, 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  Package, 
  Truck, 
  AlertCircle,
  ArrowRight
} from "lucide-react";
import { OrderHistoryItem, OrderStatus } from "@/types";

/**
 * Menghasilkan gaya visual dan ikon yang sesuai untuk setiap status pesanan.
 *
 * @param status - Status pesanan yang akan dipetakan.
 * @returns Konfigurasi warna dan ikon status.
 */
const getStatusConfig = (status: OrderStatus) => {
  switch (status) {
    case 'Pending':
      return { color: 'text-vanqis-fresh-tomato border-vanqis-fresh-tomato', icon: Clock };
    case 'Confirmed':
      return { color: 'text-vanqis-fresh-carrot border-vanqis-fresh-carrot', icon: CheckCircle2 };
    case 'Preparing':
      return { color: 'text-vanqis-fresh-grape border-vanqis-fresh-grape', icon: Package };
    case 'Processing':
      return { color: 'text-vanqis-fresh-banana border-vanqis-fresh-banana', icon: Loader2 };
    case 'Shipping':
      return { color: 'text-vanqis-fresh-carrot border-vanqis-fresh-carrot', icon: Truck };
    case 'Completed':
      return { color: 'text-vanqis-core-green border-vanqis-core-green', icon: CheckCircle2 };
    default:
      return { color: 'text-vanqis-base-text border-vanqis-base-text', icon: AlertCircle };
  }
};

/**
 * Menampilkan daftar riwayat pesanan milik pengguna.
 *
 * @returns Halaman riwayat pesanan.
 */
const Orders = () => {
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await api.get("/orders/");
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-vanqis-base-text" />
      </div>
    );
  }

  const orders: OrderHistoryItem[] = data?.results || [];

  return (
    <div className="container-app py-8 md:py-12 max-w-5xl mx-auto">
      {/* Ringkasan Atas */}
      <div className="mb-10 pb-6 border-b border-vanqis-base-soft">
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-vanqis-base-text leading-none">
          Riwayat Pesanan
        </h1>
        <p className="text-[10px] font-bold uppercase tracking-widest text-vanqis-base-text/50 mt-2">
          Pantau status belanja Anda
        </p>
      </div>

      {orders.length === 0 ? (
        <>
          {/* Keadaan Kosong */}
          <div className="flex flex-col items-center justify-center py-24 px-4 text-center border border-vanqis-base-soft bg-vanqis-base-white/50">
            <div className="w-20 h-20 bg-vanqis-base-soft flex items-center justify-center mb-8">
              <ShoppingBag className="w-8 h-8 text-vanqis-base-text/40" strokeWidth={1} />
            </div>
            <h3 className="font-black text-2xl uppercase tracking-tight text-vanqis-base-text mb-3">
              Belum Ada Pesanan
            </h3>
            <p className="text-sm font-medium text-vanqis-base-text/60 mb-8 max-w-sm leading-relaxed">
              Sepertinya Anda belum pernah melakukan pemesanan buah atau sayur.
            </p>
            <button
              onClick={() => navigate("/")}
              className="h-12 px-8 bg-vanqis-base-text text-vanqis-base-white font-bold uppercase tracking-widest text-xs flex items-center justify-center hover:bg-vanqis-fresh-carrot transition-colors outline-none"
            >
              Mulai Belanja
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Daftar Pesanan */}
          <div className="flex flex-col gap-6">
          {orders.map((order) => {
            const statusConfig = getStatusConfig(order.status);
            const StatusIcon = statusConfig.icon;

            return (
              <div 
                key={order.public_id} 
                className="bg-vanqis-base-white border border-vanqis-base-soft hover:border-vanqis-base-text transition-colors cursor-pointer group flex flex-col md:flex-row md:items-center justify-between p-6 sm:p-8 relative outline-none"
                onClick={() => navigate(`/order/${order.public_id}`)}
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-vanqis-fresh-carrot scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />

                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold font-mono uppercase tracking-widest text-vanqis-base-text bg-vanqis-base-soft/50 px-2 py-1">
                      ID: {order.public_id.split('-')[0].toUpperCase()}
                    </span>
                    <span className={cn(
                      "text-[9px] font-black uppercase tracking-widest px-2 py-1 border flex items-center gap-1.5",
                      statusConfig.color
                    )}>
                      <StatusIcon className="w-3 h-3" strokeWidth={2.5} />
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-vanqis-base-text/50">
                      Waktu Pesanan
                    </p>
                    <p className="text-sm font-bold text-vanqis-base-text">
                      {format(new Date(order.created_at), "d MMMM yyyy, HH:mm", { locale: id })}
                    </p>
                  </div>
                </div>

                <div className="mt-6 md:mt-0 flex items-end justify-between md:flex-col md:items-end gap-2 md:gap-4 border-t md:border-t-0 border-vanqis-base-soft pt-6 md:pt-0">
                  <div className="text-left md:text-right">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-vanqis-base-text/50 mb-1">Total Pembayaran</p>
                    <p className="text-2xl font-black tracking-tight text-vanqis-base-text leading-none group-hover:text-vanqis-fresh-carrot transition-colors">
                      {formatPrice(order.total_price)}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-vanqis-base-text group-hover:text-vanqis-fresh-carrot transition-colors">
                    Lihat Detail
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        </>
      )}
    </div>
  );
};

export default Orders;
