import { useState, useRef, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { uploadPaymentProof, formatPrice, getOrder } from '@/lib/api';
import type { OrderResponse } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Upload, CheckCircle2, Loader2, FileImage, AlertCircle } from 'lucide-react';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

export default function PaymentUpload() {
  const { publicId } = useParams<{ publicId: string }>();
  const location = useLocation();
  const { toast } = useToast();
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const init = async () => {
      if (!publicId) return;

      const state = location.state as { accessToken?: string; order?: OrderResponse } | null;
      let token = state?.accessToken || localStorage.getItem(`order_token_${publicId}`);
      let orderData = state?.order;

      if (!token) {
        setLoadingOrder(false);
        return;
      }

      setAccessToken(token);

      if (!orderData) {
        try {
          const data = await getOrder(publicId, token);
          orderData = data;
        } catch (err) {
          console.error('Failed to fetch order for upload:', err);
        }
      }

      setOrder(orderData || null);
      setLoadingOrder(false);
    };

    init();
  }, [publicId, location.state]);

  if (loadingOrder) {
    return (
      <div className="container-app py-20 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Memvalidasi akses...</p>
      </div>
    );
  }

  if (!publicId || !accessToken) {
    return (
      <div className="container-app py-20 text-center">
        <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="font-semibold text-lg mb-2">Akses tidak valid</h2>
        <p className="text-sm text-muted-foreground mb-4">Halaman ini hanya dapat diakses setelah checkout.</p>
        <Link to="/" className="text-sm text-accent-foreground hover:underline">Kembali ke beranda</Link>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!ALLOWED_TYPES.includes(selected.type)) {
      setError('File harus berupa gambar (JPG, PNG)');
      return;
    }
    if (selected.size > MAX_FILE_SIZE) {
      setError('Ukuran file maksimal 5MB');
      return;
    }

    setFile(selected);
    const reader = new FileReader();
    reader.onload = ev => setPreview(ev.target?.result as string);
    reader.readAsDataURL(selected);
  };

  const handleUpload = async () => {
    if (!file || !accessToken || !publicId) return;
    setUploading(true);
    setError(null);
    try {
      await uploadPaymentProof(publicId, accessToken, file);
      setSuccess(true);
      toast({ title: 'Bukti pembayaran berhasil diupload' });
    } catch (err: unknown) {
      let msg = 'Gagal mengupload bukti pembayaran';
      if (err && typeof err === 'object' && 'response' in err) {
        const resp = (err as { response: { status: number; data?: { detail?: string } } }).response;
        if (resp.status === 409) msg = 'Bukti pembayaran sudah pernah diupload';
        else if (resp.data?.detail) msg = resp.data.detail;
      }
      setError(msg);
    } finally {
      setUploading(false);
    }
  };

  if (success) {
    return (
      <div className="container-app py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-accent-foreground" />
        </div>
        <h2 className="text-xl font-bold mb-2">Pembayaran Terkirim!</h2>
        <p className="text-sm text-muted-foreground mb-2 max-w-md mx-auto">
          Bukti pembayaran Anda telah berhasil diupload. Admin akan memverifikasi pembayaran Anda.
        </p>
        {order && (
          <p className="text-xs text-muted-foreground mb-6">Order ID: {order.public_id}</p>
        )}
        <Link
          to="/"
          className="inline-block px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  return (
    <div className="container-app py-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-2">Upload Bukti Pembayaran</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Silakan transfer sesuai total pesanan, lalu upload bukti pembayaran.
      </p>

      {order && (
        <div className="bg-card rounded-2xl border p-6 mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Order ID</span>
            <span className="font-mono text-xs">{order.public_id.slice(0, 8)}...</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Nama</span>
            <span className="font-medium">{order.customer_name}</span>
          </div>
          <div className="flex justify-between font-bold border-t pt-3 mt-3">
            <span>Total</span>
            <span>{formatPrice(order.total_price)}</span>
          </div>
        </div>
      )}

      <div className="bg-card rounded-2xl border p-6 space-y-4">
        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-accent/50 transition-colors"
        >
          {preview ? (
            <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-lg object-contain" />
          ) : (
            <>
              <FileImage className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm font-medium mb-1">Klik untuk memilih gambar</p>
              <p className="text-xs text-muted-foreground">JPG atau PNG, maksimal 5MB</p>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {file && (
          <p className="text-xs text-muted-foreground truncate">
            {file.name} ({(file.size / 1024 / 1024).toFixed(1)} MB)
          </p>
        )}

        {error && (
          <p className="text-xs text-destructive flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> {error}
          </p>
        )}

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {uploading ? 'Mengupload...' : 'Upload Bukti'}
        </button>
      </div>
    </div>
  );
}
