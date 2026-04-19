import type { Category } from '@/types';
import { cn } from '@/lib/utils';

interface Props {
  categories: Category[];
  selected: number | null;
  onSelect: (id: number | null) => void;
}

/**
 * Menampilkan daftar filter kategori untuk menyaring katalog produk.
 *
 * @param categories - Daftar kategori yang tersedia.
 * @param selected - ID kategori yang sedang aktif.
 * @param onSelect - Callback saat kategori dipilih.
 * @returns Deretan tombol filter kategori.
 */
export default function CategoryFilter({ categories, selected, onSelect }: Props) {
  return (
    <div className="flex gap-6 overflow-x-auto pb-2 scrollbar-none border-b border-vanqis-base-soft">
      {/* Semua */}
      <button
        onClick={() => onSelect(null)}
        className={cn(
          "shrink-0 pb-3 text-xs font-black uppercase tracking-widest transition-colors relative outline-none",
          selected === null
            ? "text-vanqis-base-text"
            : "text-vanqis-base-text/40 hover:text-vanqis-base-text"
        )}
      >
        All
        {selected === null && (
          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-vanqis-fresh-carrot" />
        )}
      </button>
      {/* Kategori */}
      {categories.map(cat => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={cn(
            "shrink-0 pb-3 text-xs font-black uppercase tracking-widest transition-colors relative outline-none",
            selected === cat.id
              ? "text-vanqis-base-text"
              : "text-vanqis-base-text/40 hover:text-vanqis-base-text"
          )}
        >
          {cat.name}
          {selected === cat.id && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-vanqis-fresh-carrot" />
          )}
        </button>
      ))}
    </div>
  );
}
