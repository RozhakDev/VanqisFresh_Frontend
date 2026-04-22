import { Loader2, ArrowRight } from 'lucide-react';
import { formatPrice, cn } from '@/lib/utils';

interface Props {
  items: any[];
  total: number;
  method: 'whatsapp' | 'manual';
  onCheckout: () => void;
  loading: boolean;
  disabled: boolean;
}

/**
 * Menampilkan ringkasan pesanan dan mengontrol aksi checkout.
 *
 * @param items - Daftar produk dalam keranjang.
 * @param total - Total harga pesanan.
 * @param method - Metode pembayaran terpilih.
 * @param onCheckout - Fungsi untuk mengeksekusi pemesanan.
 * @param loading - Status pemrosesan data.
 * @param disabled - Status penonaktifan tombol konfirmasi.
 * @returns Komponen sidebar ringkasan pesanan.
 */
export default function OrderSummary({ items, total, method, onCheckout, loading, disabled }: Props) {
  return (
    <div className="bg-vanqis-base-white border border-vanqis-base-text p-8 sticky top-24">
      {/* Header Ringkasan */}
      <h2 className="text-xl font-black uppercase tracking-tight text-vanqis-base-text mb-8 pb-4 border-b border-vanqis-base-soft">
        Ringkasan Pesanan
      </h2>
      
      {/* Daftar Item */}
      <div className="space-y-4 text-sm mb-8 font-medium">
        {items.map(({ product, quantity }) => (
          <div key={product.id} className="flex justify-between items-start gap-4">
            <span className="text-vanqis-base-text/70 line-clamp-2">
              {product.name} <span className="text-vanqis-base-text font-bold">x{quantity}</span>
            </span>
            <span className="shrink-0 text-vanqis-base-text font-bold">
              {formatPrice(product.price * quantity)}
            </span>
          </div>
        ))}
      </div>
      
      {/* Total Harga */}
      <div className="border-t border-vanqis-base-text pt-6 flex flex-col gap-2 mb-8">
        <div className="flex justify-between items-end">
          <span className="text-[10px] font-bold uppercase tracking-widest text-vanqis-base-text/70">Total Bayar</span>
          <span className="text-2xl font-black text-vanqis-base-text tracking-tight leading-none">
            {formatPrice(total)}
          </span>
        </div>
      </div>
      
      {/* Tombol Konfirmasi */}
      <button
        onClick={onCheckout} 
        disabled={disabled}
        className={cn(
          "flex items-center justify-center w-full h-14 text-vanqis-base-white font-bold uppercase tracking-widest text-xs transition-all outline-none disabled:opacity-50",
          method === 'whatsapp' 
            ? "bg-[#25D366] hover:bg-[#1DA851]"
            : "bg-vanqis-base-text hover:bg-vanqis-accent"
        )}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Memproses...
          </>
        ) : (
          <>
            {method === 'whatsapp' ? 'Pesan via WhatsApp' : 'Konfirmasi & Buat Pesanan'}
            <ArrowRight className="w-4 h-4 ml-3" strokeWidth={2} />
          </>
        )}
      </button>
      
      {/* Keterangan Bawah */}
      <p className="text-[9px] font-bold uppercase tracking-widest text-vanqis-base-text/40 text-center mt-4">
        {method === 'whatsapp' 
          ? 'Anda akan diarahkan ke aplikasi WhatsApp' 
          : 'Anda akan diarahkan ke halaman pembayaran'}
      </p>
    </div>
  );
}
