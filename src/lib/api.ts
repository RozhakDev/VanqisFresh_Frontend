import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Menyisipkan token akses ke setiap permintaan yang terautentikasi.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Menangani pembaruan token ketika server mengembalikan status tidak sah.
 */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refresh-token");
      
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/users/token/refresh/`, {
            refresh: refreshToken,
          });
          
          const { access } = response.data;
          localStorage.setItem("auth-token", access);
          
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem("auth-token");
          localStorage.removeItem("refresh-token");
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Mengambil daftar kategori produk dari API katalog.
 */
export const getCategories = async () => {
  const response = await api.get("/catalog/categories/");
  return response.data;
};

/**
 * Mengambil daftar produk dengan parameter penyaring opsional.
 *
 * @param params - Parameter kueri untuk pencarian, filter, dan urutan.
 */
export const getProducts = async (params?: any) => {
  const response = await api.get("/catalog/products/", { params });
  return response.data;
};

/**
 * Mengambil detail satu produk berdasarkan ID.
 *
 * @param id - ID produk yang ingin dimuat.
 */
export const getProduct = async (id: number | string) => {
  const response = await api.get(`/catalog/products/${id}/`);
  return response.data;
};

/**
 * Mengambil daftar promo aktif yang ditampilkan di beranda.
 */
export const getPromos = async () => {
  const response = await api.get("/catalog/promos/");
  return response.data;
};

/**
 * Mengambil daftar kontak resmi toko untuk bagian footer.
 */
export const getStoreContacts = async () => {
  const response = await api.get("/core/contacts/");
  return response.data;
};

export default api;
