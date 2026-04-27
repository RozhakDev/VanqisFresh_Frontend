import { useState } from "react";
import { CreditCard, QrCode, Copy, X } from "lucide-react";
import { toast } from "sonner";
import type { PaymentMethod } from "@/types";

interface Props {
  paymentMethods: PaymentMethod[];
}

/**
 * Komponen reusable untuk menampilkan daftar metode pembayaran beserta QRIS.
 *
 * @param props - Properti komponen.
 * @param props.paymentMethods - Daftar metode pembayaran dari API.
 * @returns Tampilan daftar rekening dan QRIS.
 */
export default function PaymentMethodsList({ paymentMethods }: Props) {
  const [expandedQris, setExpandedQris] = useState<string | null>(null);

  /**
   * Menyalin teks ke clipboard.
   */
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Nomor berhasil disalin!");
  };

  if (!paymentMethods || paymentMethods.length === 0) {
    return <p className="text-xs font-medium text-vanqis-base-text/50 py-4 text-center">Belum ada metode pembayaran yang dikonfigurasi admin.</p>;
  }

  return (
    <>
      <div className="space-y-6">
        <h2 className="text-xs font-black uppercase tracking-widest text-vanqis-base-text flex items-center gap-2 pb-2 border-b border-vanqis-base-soft">
          <CreditCard className="w-4 h-4" strokeWidth={2} /> Informasi Rekening / Tujuan Transfer
        </h2>
        
        <div className="grid gap-4">
          {paymentMethods.map((pm) => (
            <div key={pm.id} className="border border-vanqis-base-soft p-5 hover:border-vanqis-base-text transition-colors group bg-vanqis-base-white">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-vanqis-base-soft/50 flex items-center justify-center shrink-0">
                  {pm.provider_type === 'QRIS' ? (
                    <QrCode className="w-5 h-5 text-vanqis-base-text" />
                  ) : (
                    <span className="text-sm font-black text-vanqis-base-text">{pm.name.slice(0, 2).toUpperCase()}</span>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-sm text-vanqis-base-text uppercase tracking-wide">{pm.name}</p>
                      <p className="text-[10px] font-bold text-vanqis-base-text/50 uppercase tracking-widest mb-2">{pm.provider_type}</p>
                    </div>
                    {pm.provider_type === 'QRIS' && (
                      <span className="bg-vanqis-accent text-vanqis-base-white text-[8px] font-black uppercase tracking-widest px-2 py-0.5">Scan</span>
                    )}
                  </div>
                  
                  {pm.account_number && (
                    <div className="bg-vanqis-base-soft/30 p-3 mt-2 flex justify-between items-center group/copy cursor-pointer" onClick={() => copyToClipboard(pm.account_number!)}>
                      <div>
                        <p className="font-mono text-sm font-bold text-vanqis-base-text">{pm.account_number}</p>
                        <p className="text-[10px] font-medium text-vanqis-base-text/60">a.n {pm.account_name}</p>
                      </div>
                      <Copy className="w-4 h-4 text-vanqis-base-text/30 group-hover/copy:text-vanqis-base-text transition-colors" />
                    </div>
                  )}

                  {pm.qr_code && (
                    <div className="mt-4 pt-4 border-t border-vanqis-base-soft flex flex-col items-center">
                      <p className="text-[9px] font-bold text-vanqis-base-text/40 uppercase tracking-widest mb-3">Ketuk gambar untuk memperbesar</p>
                      <button 
                        className="p-2 border border-vanqis-base-soft bg-white inline-block cursor-zoom-in hover:border-vanqis-base-text transition-colors outline-none"
                        onClick={() => setExpandedQris(pm.qr_code!)}
                      >
                        <img src={pm.qr_code} alt={`QRIS ${pm.name}`} className="w-32 h-32 object-contain" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal QRIS */}
      {expandedQris && (
        <div 
          className="fixed inset-0 z-[100] bg-vanqis-base-white/95 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setExpandedQris(null)}
        >
          <button 
            className="absolute top-4 right-4 sm:top-8 sm:right-8 w-14 h-14 bg-vanqis-base-text text-vanqis-base-white flex items-center justify-center hover:bg-vanqis-fresh-tomato transition-colors shadow-2xl z-50 rounded-none outline-none"
            onClick={(e) => {
              e.stopPropagation();
              setExpandedQris(null);
            }}
          >
            <X className="w-6 h-6" strokeWidth={2} />
          </button>
          
          <div 
            className="bg-white p-6 sm:p-12 border-4 border-vanqis-base-text shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col items-center overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl sm:text-4xl font-black uppercase tracking-widest text-vanqis-base-text mb-8 sm:mb-12 text-center">
              Scan QRIS
            </h3>
            <div className="w-full aspect-square relative flex items-center justify-center bg-vanqis-base-white">
              <img 
                src={expandedQris} 
                alt="QRIS Fullscreen" 
                className="absolute inset-0 w-full h-full object-contain"
              />
            </div>
            <p className="mt-8 sm:mt-12 text-sm sm:text-base font-bold text-vanqis-base-text/60 uppercase tracking-widest text-center">
              Pastikan nama tujuan penerima adalah<br/>
              <span className="text-vanqis-base-text font-black text-lg sm:text-xl mt-2 block">VanqisStore</span>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
