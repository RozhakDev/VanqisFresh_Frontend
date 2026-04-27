import {
  Clock,
  CheckCircle2,
  Package,
  Loader2,
  Truck,
  AlertCircle,
  LucideIcon
} from "lucide-react";
import type { OrderStatus } from "@/types";

interface OrderStatusConfig {
  color: string;
  bgColor: string;
  icon: LucideIcon;
  label: string;
}

/**
 * Menghasilkan konfigurasi UI (warna, ikon, dan label) berdasarkan status pesanan.
 *
 * @param status - Status pesanan.
 * @returns Objek berisi kelas CSS untuk warna, warna latar, ikon, dan label.
 */
export const getOrderStatusConfig = (status: OrderStatus): OrderStatusConfig => {
  switch (status) {
    case 'Pending':
      return { 
        color: 'text-vanqis-fresh-tomato border-vanqis-fresh-tomato',
        bgColor: 'bg-vanqis-fresh-tomato/5',
        icon: Clock, 
        label: 'Menunggu Pembayaran' 
      };
    case 'Confirmed':
      return { 
        color: 'text-vanqis-accent border-vanqis-accent',
        bgColor: 'bg-vanqis-accent/5',
        icon: CheckCircle2, 
        label: 'Menunggu Diproses' 
      };
    case 'Preparing':
      return { 
        color: 'text-vanqis-fresh-grape border-vanqis-fresh-grape',
        bgColor: 'bg-vanqis-fresh-grape/5',
        icon: Package, 
        label: 'Sedang Disiapkan' 
      };
    case 'Processing':
      return { 
        color: 'text-vanqis-fresh-banana border-vanqis-fresh-banana',
        bgColor: 'bg-vanqis-fresh-banana/5',
        icon: Loader2, 
        label: 'Sedang Diproses' 
      };
    case 'Shipping':
      return { 
        color: 'text-vanqis-accent border-vanqis-accent',
        bgColor: 'bg-vanqis-accent/5',
        icon: Truck, 
        label: 'Sedang Dikirim' 
      };
    case 'Completed':
      return { 
        color: 'text-vanqis-core-green border-vanqis-core-green',
        bgColor: 'bg-vanqis-core-green/5',
        icon: CheckCircle2, 
        label: 'Selesai' 
      };
    default:
      return { 
        color: 'text-vanqis-base-text border-vanqis-base-text',
        bgColor: 'bg-vanqis-base-text/5',
        icon: AlertCircle, 
        label: status 
      };
  }
};
