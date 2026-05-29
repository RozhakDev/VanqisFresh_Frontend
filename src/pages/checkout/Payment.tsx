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
  ArrowLeft
} from "lucide-react";

import type { OrderDetail, PaymentMethod } from "@/types";
import PaymentMethodsList from "@/components/checkout/PaymentMethodsList";

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
  const [isSuccess, setIsSuccess] = useState(false);

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
      setIsSuccess(true);
    } catch (error: any) {
      const message = error.response?.data?.detail || error.response?.data?.image?.[0] || "Gagal mengunggah bukti pembayaran";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
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
        <button onClick={() => navigate("/")} className="text-xs font-bold uppercase tracking-widest border-b border-vanqis-base-text pb-1 hover:text-vanqis-accent transition-colors">
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="container-app py-16 md:py-24 flex flex-col items-center justify-center min-h-[60vh] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-vanqis-core-green/5 rounded-full blur-3xl -z-10" />
        
        <div className="bg-vanqis-base-white p-10 md:p-16 border border-vanqis-base-soft shadow-vanqis-base-text/5 flex flex-col items-center text-center max-w-lg w-full relative z-10 transition-all duration-500 animate-in fade-in zoom-in-95">
          <div className="w-24 h-24 bg-vanqis-core-green/10 flex items-center justify-center rounded-full mb-8 animate-bounce-short">
             <CheckCircle2 className="w-10 h-10 text-vanqis-core-green" strokeWidth={2.5} />
          </div>
          
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-vanqis-base-text mb-3">
            Pembayaran Terkirim
          </h2>
          
          <p className="text-sm font-medium text-vanqis-base-text/60 leading-relaxed mb-8">
            Terima kasih! Bukti transfer Anda telah berhasil diunggah. Kami akan memverifikasi pembayaran Anda dan segera memproses pesanan Anda.
          </p>

          <button 
            onClick={() => navigate(`/order/${publicId}`)} 
            className="w-full flex items-center justify-center h-14 bg-vanqis-base-text text-vanqis-base-white font-bold uppercase tracking-widest text-xs hover:bg-vanqis-accent transition-colors outline-none"
          >
            Lihat Detail Pesanan
          </button>
        </div>
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

            <PaymentMethodsList paymentMethods={paymentMethods} />
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
                  className="w-full flex items-center justify-center h-14 bg-vanqis-base-text text-vanqis-base-white font-bold uppercase tracking-widest text-xs hover:bg-vanqis-accent transition-colors outline-none disabled:opacity-50"
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
    </>
  );
};

export default PaymentUpload;
