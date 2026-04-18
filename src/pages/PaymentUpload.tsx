import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { toast } from "sonner";
import { 
  Loader2, 
  Upload, 
  Image as ImageIcon, 
  X, 
  CheckCircle2,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

const PaymentUpload = () => {
  const { publicId } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validasi tipe file
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(selectedFile.type)) {
        toast.error("Format file harus JPG atau PNG");
        return;
      }
      // Validasi ukuran file (max 5MB)
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

  const removeFile = () => {
    setFile(null);
    setPreview(null);
  };

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

  return (
    <div className="container-app py-10 max-w-2xl mx-auto px-4">
      <Button 
        variant="ghost" 
        className="mb-6 -ml-2" 
        onClick={() => navigate(`/order/${publicId}`)}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Kembali ke Detail Pesanan
      </Button>

      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Unggah Bukti Pembayaran</CardTitle>
          <p className="text-sm text-muted-foreground">
            Unggah foto struk atau screenshot bukti transfer Anda
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {!preview ? (
            <div 
              className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-12 text-center hover:border-primary/50 transition-colors cursor-pointer bg-muted/5"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <div className="flex flex-col items-center">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <p className="font-semibold mb-1">Klik untuk memilih gambar</p>
                <p className="text-xs text-muted-foreground uppercase">JPG, PNG (Maks 5MB)</p>
              </div>
              <input 
                id="file-upload"
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          ) : (
            <div className="relative rounded-xl overflow-hidden border">
              <img 
                src={preview} 
                alt="Preview" 
                className="w-full h-auto max-h-[400px] object-contain bg-black/5" 
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 rounded-full h-8 w-8"
                onClick={removeFile}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}

          <div className="bg-muted/30 p-4 rounded-lg flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
            <div className="text-xs text-muted-foreground leading-relaxed">
              <p className="font-semibold text-foreground mb-1">Tips Unggah Bukti:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Pastikan tulisan pada bukti transfer terlihat jelas.</li>
                <li>Pastikan nominal transfer sesuai dengan total belanja.</li>
                <li>Simpan bukti asli sampai pesanan Anda dikonfirmasi oleh admin.</li>
              </ul>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full h-12 text-lg font-bold" 
            disabled={!file || isLoading}
            onClick={handleUpload}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Mengunggah...
              </>
            ) : (
              "Kirim Bukti Pembayaran"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentUpload;
