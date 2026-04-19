import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts, getCategories, getPromos } from '@/lib/api';
import type { Product, Category, Promo } from '@/types';
import ProductCard from '@/components/catalog/ProductCard';
import CategoryFilter from '@/components/catalog/CategoryFilter';
import PromoBanner from '@/components/catalog/PromoBanner';
import { ProductGridSkeleton } from '@/components/shared/LoadingSkeleton';
import EmptyState from '@/components/shared/EmptyState';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Merender halaman katalog utama dan mengelola pemuatan data produk.
 *
 * @returns Halaman beranda katalog.
 */
export default function Index() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [promos, setPromos] = useState<Promo[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [ordering, setOrdering] = useState<string>('-created_at');

  /**
   * Mengambil daftar produk sesuai filter, urutan, dan halaman aktif.
   */
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getProducts({
        search: searchQuery || undefined,
        category: selectedCategory ?? undefined,
        is_available: true,
        ordering,
        page,
        page_size: 12,
      });
      setProducts(data.results);
      setTotalPages(data.total_pages);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory, ordering, page]);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
    getPromos().then(setPromos).catch(() => {});
  }, []);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedCategory, ordering]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="container-app py-6 space-y-6">
      {/* Promo Banner */}
      {!searchQuery && <PromoBanner promos={promos} />}

      {/* Filter Utama */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-6 border-b border-vanqis-base-soft">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-vanqis-base-text">
            {searchQuery ? `Hasil Pencarian "${searchQuery}"` : 'Katalog Produk'}
          </h1>
          <p className="text-xs font-bold tracking-widest uppercase text-vanqis-base-text/50 mt-1">Buah & sayur segar pilihan</p>
        </div>
        
        <div className="relative group shrink-0">
          <select
            value={ordering}
            onChange={e => setOrdering(e.target.value)}
            className="appearance-none w-full sm:w-auto h-11 pl-4 pr-10 border border-vanqis-base-soft bg-transparent text-vanqis-base-text text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-vanqis-base-text transition-colors cursor-pointer"
          >
            <option value="-created_at">Terbaru</option>
            <option value="price">Harga Terendah</option>
            <option value="-price">Harga Tertinggi</option>
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-vanqis-base-text text-xs">
            ▼
          </div>
        </div>
      </div>

      {/* Filter Kategori */}
      <CategoryFilter
        categories={categories}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {/* Daftar Produk */}
      {loading ? (
        <ProductGridSkeleton />
      ) : products.length === 0 ? (
        <EmptyState
          title="Produk tidak ditemukan"
          description="Coba ubah kata kunci atau filter kategori"
          showAction={false}
        />
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-12 border-t border-vanqis-base-soft mt-8">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-11 h-11 border border-vanqis-base-soft flex items-center justify-center disabled:opacity-30 hover:border-vanqis-base-text hover:bg-vanqis-base-text hover:text-vanqis-base-white transition-all disabled:hover:bg-transparent disabled:hover:text-vanqis-base-text disabled:hover:border-vanqis-base-soft text-vanqis-base-text"
              >
                <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
              </button>
              <span className="text-xs font-bold uppercase tracking-widest text-vanqis-base-text px-4">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-11 h-11 border border-vanqis-base-soft flex items-center justify-center disabled:opacity-30 hover:border-vanqis-base-text hover:bg-vanqis-base-text hover:text-vanqis-base-white transition-all disabled:hover:bg-transparent disabled:hover:text-vanqis-base-text disabled:hover:border-vanqis-base-soft text-vanqis-base-text"
              >
                <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
