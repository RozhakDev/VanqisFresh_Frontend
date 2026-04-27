import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import type { OrderDetail, OrderHistoryItem, PaginatedResponse } from "@/types";

const POLLING_INTERVAL = Number(import.meta.env.VITE_ORDER_POLLING_INTERVAL) || 30000;

/**
 * Hook khusus untuk mengambil dan memantau detail pesanan secara real-time.
 * Menggunakan sistem polling background (refetchInterval).
 *
 * @param publicId - ID publik unik pesanan.
 * @returns Objek state query dari React Query.
 */
export const useOrderDetail = (publicId: string | undefined) => {
  return useQuery<OrderDetail>({
    queryKey: ["order", publicId],
    queryFn: async () => {
      const response = await api.get(`/orders/${publicId}/`);
      return response.data;
    },
    enabled: !!publicId,
    refetchInterval: POLLING_INTERVAL,
    refetchIntervalInBackground: false, 
  });
};

/**
 * Hook khusus untuk mengambil daftar riwayat pesanan milik pengguna yang sedang masuk.
 *
 * @param isAuthenticated - Flag penentu untuk memastikan query hanya berjalan saat user login.
 * @returns Objek state query dari React Query.
 */
export const useOrderHistory = (isAuthenticated: boolean) => {
  return useQuery<PaginatedResponse<OrderHistoryItem>>({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await api.get("/orders/");
      return response.data;
    },
    enabled: isAuthenticated,
  });
};
