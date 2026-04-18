import axios from 'axios';
import type {
  Category, Product, PaginatedResponse, Promo,
  PaymentMethod, StoreContact, CheckoutPayload, OrderResponse
} from '@/types';

const api = axios.create({
  baseURL: 'https://api.vanqismart.com/api/v1',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

export async function getCategories(): Promise<Category[]> {
  const { data } = await api.get('/catalog/categories/');
  return data;
}

export async function getProducts(params?: {
  search?: string;
  category?: number;
  is_available?: boolean;
  ordering?: string;
  page?: number;
  page_size?: number;
}): Promise<PaginatedResponse<Product>> {
  const { data } = await api.get('/catalog/products/', { params });
  return data;
}

export async function getProduct(id: number): Promise<Product> {
  const { data } = await api.get(`/catalog/products/${id}/`);
  return data;
}

export async function getPromos(): Promise<Promo[]> {
  const { data } = await api.get('/catalog/promos/');
  return data;
}

export async function getPaymentMethods(): Promise<PaymentMethod[]> {
  const { data } = await api.get('/core/payments/');
  return data;
}

export async function getStoreContacts(): Promise<StoreContact[]> {
  const { data } = await api.get('/core/contacts/');
  return data;
}

export async function createOrder(payload: CheckoutPayload): Promise<OrderResponse> {
  const { data } = await api.post('/orders/checkout/', payload);
  return data;
}

export async function getOrder(publicId: string, accessToken: string): Promise<OrderResponse> {
  const { data } = await api.get(`/orders/${publicId}/`, {
    // Hapus header X-Order-Token karena menyebabkan CORS error di browser
    params: { access_token: accessToken }
  });
  return data;
}

export async function uploadPaymentProof(
  publicId: string,
  accessToken: string,
  imageFile: File
): Promise<{ message: string; data: { image: string; uploaded_at: string } }> {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  // Menggunakan query params untuk token agar aman dari CORS preflight
  const { data } = await api.post(`/orders/${publicId}/upload-proof/`, formData, {
    params: { access_token: accessToken },
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}
