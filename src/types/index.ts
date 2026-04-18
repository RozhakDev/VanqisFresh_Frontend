export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  category: number;
  category_name: string;
  price: number;
  description: string;
  image: string;
  stock: number;
  is_available: boolean;
}

export interface PaginatedResponse<T> {
  count: number;
  total_pages: number;
  current_page: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface Promo {
  id: number;
  title: string;
  description: string;
  products: Product[];
  is_active: boolean;
}

export interface PaymentMethod {
  id: number;
  name: string;
  provider_type: 'bank' | 'e-wallet' | 'qris';
  account_number: string | null;
  account_name: string;
  qr_code: string | null;
}

export interface StoreContact {
  id: number;
  platform: string;
  account_id: string;
  url: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CheckoutPayload {
  customer_name: string;
  customer_contact: string;
  note?: string;
  items: { product_id: number; quantity: number }[];
}

export interface OrderResponse {
  id: number;
  public_id: string;
  access_token: string;
  upload_proof_url: string;
  customer_name: string;
  customer_contact: string;
  note: string;
  total_price: number;
  status: 'Pending' | 'Confirmed' | 'Completed';
  items: {
    product_name: string;
    quantity: number;
    price: number;
  }[];
  payment_proof: 'Sudah diunggah' | 'Belum diunggah';
  created_at: string;
}
