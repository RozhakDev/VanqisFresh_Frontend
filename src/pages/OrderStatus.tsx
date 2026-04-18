import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { formatPrice } from "@/lib/utils";
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
  Image as ImageIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OrderDetail, OrderStatus } from "@/types";

const getStatusConfig = (status: OrderStatus) => {
  switch (status) {
    case 'Pending':
      return { color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    case 'Confirmed':
      return { color: 'bg-blue-100 text-blue-800 border-blue-200' };
    case 'Preparing':
      return { color: 'bg-purple-100 text-purple-800 border-purple-200' };
    case 'Processing':
      return { color: 'bg-indigo-100 text-indigo-800 border-indigo-200' };
    case 'Shipping':
      return { color: 'bg-orange-100 text-orange-800 border-orange-200' };
    case 'Completed':
      return { color: 'bg-green-100 text-green-800 border-green-200' };
    default:
      return { color: 'bg-gray-100 text-gray-800 border-gray-200' };
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
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container-app py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Pesanan Tidak Ditemukan</h2>
        <p className="text-muted-foreground mb-8">Maaf, kami tidak dapat menemukan informasi untuk pesanan ini.</p>
        <Button onClick={() => navigate("/orders")}>Kembali ke Riwayat</Button>
      </div>
    );
  }

  const statusConfig = getStatusConfig(order.status);

  return (
    <div className="container-app py-6 max-w-4xl mx-auto px-4">
      <Button 
        variant="ghost" 
        className="mb-6 -ml-2" 
        onClick={() => navigate("/orders")}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Kembali ke Riwayat
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Header Status */}
          <Card className="overflow-hidden border-t-4 border-t-primary">
            <CardHeader className="bg-muted/30 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1">ID Pesanan</p>
                  <h1 className="text-xl font-bold">{order.public_id}</h1>
                </div>
                <Badge className={`${statusConfig.color} text-sm px-4 py-1`}>
                  {order.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-full">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Waktu Pesanan</p>
                    <p className="text-sm font-medium">
                      {format(new Date(order.created_at), "d MMM yyyy, HH:mm", { locale: id })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-full">
                    <CreditCard className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Pembayaran</p>
                    <p className="text-sm font-medium">{order.payment_proof}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rincian Produk */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Rincian Produk
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start py-2 border-b last:border-0">
                    <div className="space-y-1">
                      <p className="font-semibold text-sm">{item.product_name}</p>
                      <p className="text-xs text-muted-foreground">{item.quantity} x {formatPrice(item.price)}</p>
                    </div>
                    <p className="font-bold text-sm">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="pt-4 space-y-2">
                <div className="flex justify-between text-base font-bold text-primary pt-2 border-t">
                  <span>Total Harga</span>
                  <span>{formatPrice(order.total_price)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bukti Pembayaran */}
          {order.status === 'Pending' && order.payment_proof === 'Belum diunggah' && (
            <Card className="border-dashed border-2 bg-yellow-50/30">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-yellow-700">
                  <ImageIcon className="w-5 h-5" />
                  Konfirmasi Pembayaran
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-yellow-700/80 mb-4">
                  Pesanan Anda sudah diterima, namun kami belum menerima bukti transfer. Silakan unggah bukti pembayaran agar kami dapat segera memproses pesanan Anda.
                </p>
                <Button 
                  onClick={() => navigate(`/payment/${order.public_id}`)}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  Unggah Bukti Pembayaran
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          {/* Informasi Pengiriman */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informasi Pengiriman</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex gap-3">
                  <User className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div className="text-sm">
                    <p className="text-muted-foreground text-xs uppercase font-semibold">Nama Penerima</p>
                    <p className="font-medium">{order.customer_name}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Phone className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div className="text-sm">
                    <p className="text-muted-foreground text-xs uppercase font-semibold">Kontak</p>
                    <p className="font-medium">{order.customer_contact}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div className="text-sm">
                    <p className="text-muted-foreground text-xs uppercase font-semibold">Alamat</p>
                    <p className="font-medium">{order.shipping_address}</p>
                  </div>
                </div>
              </div>
              {order.note && (
                <div className="pt-4 border-t">
                  <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Catatan</p>
                  <p className="text-sm italic text-muted-foreground">"{order.note}"</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderStatusPage;
