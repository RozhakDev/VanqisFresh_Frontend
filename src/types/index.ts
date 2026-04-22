export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  address: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
}

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
  unit?: string;
  description: string;
  image: string | null;
  stock: number;
  is_available: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
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
  provider_type: 'Bank Transfer' | 'E-Wallet' | 'QRIS';
  account_number: string | null;
  account_name: string | null;
  qr_code: string | null;
}

export interface StoreContact {
  id: number;
  platform: string;
  account_id: string;
  url: string | null;
}

export type OrderStatus = 
  | 'Pending' 
  | 'Confirmed' 
  | 'Preparing' 
  | 'Processing' 
  | 'Shipping' 
  | 'Completed';

export interface OrderItem {
  product_name: string;
  quantity: number;
  price: number;
}

export interface OrderDetail {
  public_id: string;
  customer_name: string;
  customer_contact: string;
  shipping_address: string;
  note: string | null;
  total_price: number;
  status: OrderStatus;
  items: OrderItem[];
  payment_proof: string;
  created_at: string;
}

export interface OrderHistoryItem {
  public_id: string;
  total_price: number;
  status: OrderStatus;
  created_at: string;
}
