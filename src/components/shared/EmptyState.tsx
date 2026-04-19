import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  title: string;
  description: string;
  showAction?: boolean;
}

/**
 * Menampilkan keadaan kosong yang tetap informatif dan terarah.
 *
 * @param title - Judul keadaan kosong.
 * @param description - Penjelasan singkat untuk pengguna.
 * @param showAction - Menentukan apakah tombol aksi ditampilkan.
 * @returns Komponen keadaan kosong.
 */
export default function EmptyState({ title, description, showAction = true }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center border border-vanqis-base-soft bg-vanqis-base-white/50">
      <div className="w-20 h-20 bg-vanqis-base-soft flex items-center justify-center mb-8">
        <ShoppingBag className="w-8 h-8 text-vanqis-base-text/40" strokeWidth={1} />
      </div>
      <h3 className="font-black text-2xl uppercase tracking-tight text-vanqis-base-text mb-3">
        {title}
      </h3>
      <p className="text-sm font-medium text-vanqis-base-text/60 mb-8 max-w-sm leading-relaxed">
        {description}
      </p>
      {showAction && (
        <Link
          to="/"
          className="h-12 px-8 bg-vanqis-base-text text-vanqis-base-white font-bold uppercase tracking-widest text-xs flex items-center justify-center hover:bg-vanqis-fresh-carrot transition-colors"
        >
          Mulai Belanja
        </Link>
      )}
    </div>
  );
}
