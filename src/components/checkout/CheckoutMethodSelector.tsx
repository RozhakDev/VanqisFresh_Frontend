import { MessageCircle, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  method: 'whatsapp' | 'manual';
  onSelect: (method: 'whatsapp' | 'manual') => void;
}

/**
 * Menyediakan antarmuka pemilihan metode pembayaran pesanan.
 *
 * @param method - Nilai metode yang sedang dipilih.
 * @param onSelect - Fungsi pemicu saat metode diubah.
 * @returns Komponen grid pemilih metode.
 */
export default function CheckoutMethodSelector({ method, onSelect }: Props) {
  return (
    <section>
      {/* Header Metode */}
      <h2 className="text-sm font-black uppercase tracking-widest text-vanqis-base-text mb-4 flex items-center gap-2">
        Pilih Metode Pemesanan
      </h2>
      
      {/* Daftar Pilihan */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Tombol WhatsApp */}
        <button
          type="button"
          onClick={() => onSelect('whatsapp')}
          className={cn(
            "p-5 border text-left transition-all outline-none",
            method === 'whatsapp' 
              ? "border-vanqis-accent bg-vanqis-accent/5 ring-1 ring-vanqis-accent" 
              : "border-vanqis-base-soft hover:border-vanqis-base-text/40 bg-vanqis-base-white"
          )}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center",
              method === 'whatsapp' ? "bg-vanqis-accent text-vanqis-base-white" : "bg-vanqis-base-layout text-vanqis-base-text/60"
            )}>
              <MessageCircle className="w-4 h-4" />
            </div>
            <h3 className="font-black text-sm uppercase tracking-widest text-vanqis-base-text">WhatsApp</h3>
          </div>
          <p className="text-xs text-vanqis-base-text/70 mt-3 font-medium">Pesan langsung ke admin via WhatsApp untuk komunikasi yang lebih personal.</p>
        </button>

        {/* Tombol Transfer Manual */}
        <button
          type="button"
          onClick={() => onSelect('manual')}
          className={cn(
            "p-5 border text-left transition-all outline-none",
            method === 'manual' 
              ? "border-vanqis-base-text bg-vanqis-base-text/5 ring-1 ring-vanqis-base-text" 
              : "border-vanqis-base-soft hover:border-vanqis-base-text/40 bg-vanqis-base-white"
          )}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center",
              method === 'manual' ? "bg-vanqis-base-text text-vanqis-base-white" : "bg-vanqis-base-layout text-vanqis-base-text/60"
            )}>
              <Building2 className="w-4 h-4" />
            </div>
            <h3 className="font-black text-sm uppercase tracking-widest text-vanqis-base-text">Transfer Bank</h3>
          </div>
          <p className="text-xs text-vanqis-base-text/70 mt-3 font-medium">Pesan melalui sistem digital yang terstruktur dan terintegrasi dengan upload bukti bayar.</p>
        </button>
      </div>
    </section>
  );
}
