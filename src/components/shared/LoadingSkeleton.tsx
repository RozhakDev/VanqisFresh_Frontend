/**
 * Menampilkan placeholder grid untuk daftar produk saat data dimuat.
 *
 * @param count - Jumlah kartu skeleton yang ditampilkan.
 * @returns Grid skeleton produk.
 */
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-card rounded-2xl border overflow-hidden animate-pulse">
          <div className="aspect-square bg-secondary" />
          <div className="p-4 space-y-2">
            <div className="h-4 bg-secondary rounded w-3/4" />
            <div className="h-5 bg-secondary rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Menampilkan placeholder detail produk saat permintaan masih berjalan.
 *
 * @returns Skeleton untuk halaman detail.
 */
export function DetailSkeleton() {
  return (
    <div className="container-app py-8 animate-pulse">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="aspect-square bg-secondary rounded-2xl" />
        <div className="space-y-4">
          <div className="h-4 bg-secondary rounded w-1/4" />
          <div className="h-8 bg-secondary rounded w-3/4" />
          <div className="h-6 bg-secondary rounded w-1/3" />
          <div className="h-20 bg-secondary rounded" />
        </div>
      </div>
    </div>
  );
}
