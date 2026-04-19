import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { formatPrice, cn } from "@/lib/utils";
import { toast } from "sonner";
import { 
  Loader2, 
  Upload, 
  X, 
  CheckCircle2,
  ArrowLeft,
  CreditCard,
  QrCode,
  Copy
} from "lucide-react";

import type { OrderDetail, PaymentMethod } from "@/types";

/**
 * Menangani pengunggahan bukti pembayaran dan pilihan metode bayar.
 *
 * @returns Halaman unggah bukti pembayaran.
 */
const PaymentUpload = () => {
  const { publicId } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsLoading] = useState(false);
  const [expandedQris, setExpandedQris] = useState<string | null>(null);

  const { data: order, isLoading: isOrderLoading } = useQuery<OrderDetail>({
    queryKey: ["order", publicId],
    queryFn: async () => {
      const response = await api.get(`/orders/${publicId}/`);
      return response.data;
    },
    enabled: !!publicId,
  });

  const { data: paymentMethodsData, isLoading: isPaymentsLoading } = useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      const response = await api.get("/core/payments/");
      return response.data;
    }
  });

  /**
   * Memvalidasi file bukti pembayaran lalu menyiapkan pratinjau gambar.
   *
   * @param e - Peristiwa perubahan input file.
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(selectedFile.type)) {
        toast.error("Format file harus JPG atau PNG");
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("Ukuran file maksimal 5MB");
        return;
      }

      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  /**
   * Menghapus file dan pratinjau yang sedang dipilih.
   */
  const removeFile = () => {
    setFile(null);
    setPreview(null);
  };

  /**
   * Mengunggah bukti pembayaran ke server untuk pesanan aktif.
   */
  const handleUpload = async () => {
    if (!file) {
      toast.error("Silakan pilih file terlebih dahulu");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      await api.post(`/orders/${publicId}/upload-proof/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Bukti pembayaran berhasil diunggah!");
      navigate(`/order/${publicId}`);
    } catch (error: any) {
      const message = error.response?.data?.detail || error.response?.data?.image?.[0] || "Gagal mengunggah bukti pembayaran";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Menyalin teks ke clipboard perangkat pengguna.
   *
   * @param text - Teks yang akan disalin.
   */
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Nomor berhasil disalin!");
  };

  if (isOrderLoading || isPaymentsLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-vanqis-base-text" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container-app py-20 text-center">
        <h2 className="font-black text-2xl uppercase tracking-tight text-vanqis-base-text mb-4">Pesanan Tidak Ditemukan</h2>
        <button onClick={() => navigate("/")} className="text-xs font-bold uppercase tracking-widest border-b border-vanqis-base-text pb-1 hover:text-vanqis-fresh-carrot transition-colors">
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  const paymentMethods: PaymentMethod[] = paymentMethodsData?.results || paymentMethodsData || [];

  return (
    <>
      <div className="container-app py-8 md:py-12 max-w-5xl mx-auto relative">
        {/* Navigasi */}
        <button 
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-vanqis-base-text/60 hover:text-vanqis-base-text transition-colors mb-10 outline-none"
          onClick={() => navigate(`/order/${publicId}`)}
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
          Cek Detail Pesanan
        </button>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
          
          {/* Metode Bayar */}
          <div className="lg:col-span-6 flex flex-col gap-10">
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tight text-vanqis-base-text leading-none mb-2">
                Pembayaran
              </h1>
              <p className="text-[10px] font-bold uppercase tracking-widest text-vanqis-base-text/50">
                Selesaikan pesanan Anda
              </p>
            </div>

            <div className="bg-vanqis-base-text text-vanqis-base-white p-8 relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 w-40 h-40 border-4 border-vanqis-base-white/10 rounded-full" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-vanqis-base-white/70 mb-2 relative z-10">Total Tagihan</p>
              <p className="text-4xl font-black tracking-tight leading-none relative z-10">{formatPrice(order.total_price)}</p>
              <p className="text-[9px] mt-4 font-medium italic text-vanqis-base-white/60 relative z-10">Pesanan #{order.public_id.split('-')[0].toUpperCase()}</p>
            </div>

            <div className="space-y-6">
              <h2 className="text-xs font-black uppercase tracking-widest text-vanqis-base-text flex items-center gap-2 pb-2 border-b border-vanqis-base-soft">
                <CreditCard className="w-4 h-4" strokeWidth={2} /> Pilih Metode Pembayaran
              </h2>
              
              <div className="grid gap-4">
                {paymentMethods.map((pm) => (
                  <div key={pm.id} className="border border-vanqis-base-soft p-5 hover:border-vanqis-base-text transition-colors group">
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
                            <span className="bg-vanqis-fresh-carrot text-vanqis-base-white text-[8px] font-black uppercase tracking-widest px-2 py-0.5">Scan</span>
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
                              onClick={() => setExpandedQris(pm.qr_code)}
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
          </div>

          {/* Bukti Transfer */}
          <div className="lg:col-span-6 lg:border-l border-vanqis-base-soft lg:pl-16">
            <div className="sticky top-24 space-y-8">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-vanqis-base-text mb-2">
                  Unggah Bukti
                </h2>
                <p className="text-sm font-medium text-vanqis-base-text/60 leading-relaxed">
                  Sudah melakukan pembayaran? Unggah tangkapan layar (screenshot) atau foto struk Anda di bawah ini.
                </p>
              </div>

              <div className="space-y-6">
                {!preview ? (
                  <div 
                    className="border-2 border-dashed border-vanqis-base-soft hover:border-vanqis-base-text transition-colors cursor-pointer bg-vanqis-base-white p-12 flex flex-col items-center justify-center text-center group"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    <div className="w-14 h-14 bg-vanqis-base-soft/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Upload className="w-6 h-6 text-vanqis-base-text" strokeWidth={1.5} />
                    </div>
                    <p className="font-bold text-sm text-vanqis-base-text uppercase tracking-wider mb-1">
                      Pilih File Gambar
                    </p>
                    <p className="text-[10px] font-bold text-vanqis-base-text/40 uppercase tracking-widest">
                      Format: JPG, PNG (Maks 5MB)
                    </p>
                    <input 
                      id="file-upload"
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                ) : (
                  <div className="relative border border-vanqis-base-soft p-2 bg-vanqis-base-white">
                    <div className="bg-vanqis-base-soft/20 flex items-center justify-center overflow-hidden min-h-[300px]">
                      <img 
                        src={preview} 
                        alt="Preview Bukti Transfer" 
                        className="w-full h-auto max-h-[400px] object-contain" 
                      />
                    </div>
                    <button
                      className="absolute top-4 right-4 w-8 h-8 bg-vanqis-base-white border border-vanqis-base-text flex items-center justify-center text-vanqis-base-text hover:bg-vanqis-fresh-tomato hover:text-white hover:border-vanqis-fresh-tomato transition-colors shadow-sm"
                      onClick={removeFile}
                    >
                      <X className="w-4 h-4" strokeWidth={2} />
                    </button>
                  </div>
                )}

                <div className="bg-vanqis-base-soft/30 p-5 border-l-4 border-vanqis-core-green">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-vanqis-base-text mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-vanqis-core-green" /> Petunjuk Unggah
                  </p>
                  <ul className="text-xs font-medium text-vanqis-base-text/70 space-y-1.5 list-disc list-inside ml-1">
                    <li>Pastikan nominal, tanggal, dan nama tujuan terlihat jelas.</li>
                    <li>Screenshot dari M-Banking sangat disarankan.</li>
                    <li>Pesanan Anda akan diproses setelah pembayaran diverifikasi.</li>
                  </ul>
                </div>

                <button 
                  className="w-full flex items-center justify-center h-14 bg-vanqis-base-text text-vanqis-base-white font-bold uppercase tracking-widest text-xs hover:bg-vanqis-fresh-carrot transition-colors outline-none disabled:opacity-50"
                  disabled={!file || isUploading}
                  onClick={handleUpload}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Mengunggah...
                    </>
                  ) : (
                    "Kirim Bukti Pembayaran"
                  )}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Modal QRIS */}
      {expandedQris && (
        <div 
          className="fixed inset-0 z-[100] bg-vanqis-base-white/95 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setExpandedQris(null)}
        >
          <button 
            className="absolute top-4 right-4 sm:top-8 sm:right-8 w-14 h-14 bg-vanqis-base-text text-vanqis-base-white flex items-center justify-center hover:bg-vanqis-fresh-tomato transition-colors shadow-2xl z-50 rounded-none"
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
};

export default PaymentUpload;
