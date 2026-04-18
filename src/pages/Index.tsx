import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts, getCategories, getPromos } from '@/lib/api';
import type { Product, Category, Promo } from '@/types';
import ProductCard from '@/components/ProductCard';
import CategoryFilter from '@/components/CategoryFilter';
import PromoBanner from '@/components/PromoBanner';
import { ProductGridSkeleton } from '@/components/LoadingSkeleton';
import EmptyState from '@/components/EmptyState';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
      {!searchQuery && <PromoBanner promos={promos} />}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            {searchQuery ? `Hasil pencarian "${searchQuery}"` : 'Katalog Produk'}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Buah & sayur segar pilihan</p>
        </div>
        <select
          value={ordering}
          onChange={e => setOrdering(e.target.value)}
          className="h-10 px-3 rounded-xl bg-secondary text-sm border-0 focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="-created_at">Terbaru</option>
          <option value="price">Harga: Rendah - Tinggi</option>
          <option value="-price">Harga: Tinggi - Rendah</option>
        </select>
      </div>

      <CategoryFilter
        categories={categories}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

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
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center disabled:opacity-40 hover:bg-border transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm font-medium px-4">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center disabled:opacity-40 hover:bg-border transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
