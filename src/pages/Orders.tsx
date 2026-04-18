import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { 
  Loader2, 
  ShoppingBag, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  Package, 
  Truck, 
  AlertCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OrderHistoryItem, OrderStatus } from "@/types";

const getStatusConfig = (status: OrderStatus) => {
  switch (status) {
    case 'Pending':
      return { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock };
    case 'Confirmed':
      return { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: CheckCircle2 };
    case 'Preparing':
      return { color: 'bg-purple-100 text-purple-800 border-purple-200', icon: Package };
    case 'Processing':
      return { color: 'bg-indigo-100 text-indigo-800 border-indigo-200', icon: Loader2 };
    case 'Shipping':
      return { color: 'bg-orange-100 text-orange-800 border-orange-200', icon: Truck };
    case 'Completed':
      return { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle2 };
    default:
      return { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: AlertCircle };
  }
};

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
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const orders: OrderHistoryItem[] = data?.results || [];

  return (
    <div className="container-app py-8 max-w-4xl mx-auto px-4">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-primary/10 rounded-lg">
          <ShoppingBag className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold">Riwayat Pesanan</h1>
      </div>

      {orders.length === 0 ? (
        <Card className="text-center py-16">
          <CardContent className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              <ShoppingBag className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <CardTitle>Belum Ada Pesanan</CardTitle>
              <p className="text-muted-foreground">
                Sepertinya Anda belum pernah melakukan pemesanan buah atau sayur.
              </p>
            </div>
            <Button onClick={() => navigate("/")} variant="outline">
              Mulai Belanja
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusConfig = getStatusConfig(order.status);
            const StatusIcon = statusConfig.icon;

            return (
              <Card 
                key={order.public_id} 
                className="hover:shadow-md transition-shadow cursor-pointer group"
                onClick={() => navigate(`/order/${order.public_id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
                          ID: {order.public_id.split('-')[0].toUpperCase()}
                        </span>
                        <Badge variant="outline" className={`${statusConfig.color} flex items-center gap-1 font-medium`}>
                          <StatusIcon className="w-3 h-3" />
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Dipesan pada {format(new Date(order.created_at), "d MMMM yyyy, HH:mm", { locale: id })}
                      </p>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-6">
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground uppercase font-semibold">Total Pembayaran</p>
                        <p className="text-lg font-bold text-primary">{formatPrice(order.total_price)}</p>
                      </div>
                      <div className="p-2 rounded-full group-hover:bg-primary/10 transition-colors">
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
