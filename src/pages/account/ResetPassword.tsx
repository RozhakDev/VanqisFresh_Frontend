import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth";
import api from "@/lib/api";
import { Loader2, ArrowLeft, KeyRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const confirmSchema = z.object({
  email: z.string().email("Email tidak valid"),
  otp_code: z.string().min(6, "Kode OTP minimal 6 digit"),
  new_password: z.string().min(8, "Password minimal 8 karakter"),
});

/**
 * Merepresentasikan data formulir untuk mengatur ulang kata sandi.
 * 
 * Digunakan untuk menangani validasi OTP dan pembuatan kata sandi baru.
 */
type ConfirmFormValues = z.infer<typeof confirmSchema>;

/**
 * Menyajikan halaman reset sandi dengan konfirmasi OTP.
 * 
 * Menangani proses verifikasi kode OTP dan pembaruan kata sandi pengguna.
 * 
 * @returns Elemen halaman untuk mengatur ulang kata sandi.
 */
const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      toast.info("Anda sudah masuk ke akun.");
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);
  const [isResending, setIsResending] = useState(false);

  const defaultEmail = location.state?.email || "";

  const form = useForm<ConfirmFormValues>({
    resolver: zodResolver(confirmSchema),
    defaultValues: {
      email: defaultEmail,
      otp_code: "",
      new_password: "",
    },
  });

  /**
   * Mengirim kode OTP dan kata sandi baru untuk diproses oleh server.
   * 
   * Jika berhasil, pengguna akan langsung diarahkan ke halaman login.
   * 
   * @param values - Data formulir berisi email, kode OTP, dan sandi baru.
   * @throws Error jika proses verifikasi gagal atau sandi tidak valid.
   */
  const onSubmit = async (values: ConfirmFormValues) => {
    setIsLoading(true);
    try {
      const response = await api.post("/users/password-reset/confirm/", values);
      toast.success(response.data?.message || "Kata sandi berhasil diubah. Silakan masuk dengan kata sandi baru.");
      navigate("/login", { replace: true });
    } catch (error: any) {
      const data = error.response?.data;
      if (data?.otp_code || data?.errors?.otp_code) {
        form.setError("otp_code", { type: "server", message: data.otp_code?.[0] || data.errors?.otp_code?.[0] });
      }
      if (data?.new_password || data?.errors?.new_password) {
        form.setError("new_password", { type: "server", message: data.new_password?.[0] || data.errors?.new_password?.[0] });
      }
      
      if (!data?.otp_code && !data?.new_password && !data?.errors?.otp_code && !data?.errors?.new_password) {
        const detailError = data?.errors?.detail;
        let message =
          data?.error ||
          (Array.isArray(detailError) ? detailError[0] : detailError) ||
          data?.detail ||
          data?.message ||
          "Gagal mereset kata sandi. Pastikan kode OTP yang dimasukkan benar.";
          
        if (message === "Kode OTP tidak valid.") message = "Kode OTP tidak valid. Silakan periksa kembali.";
        else if (message === "Kode OTP sudah kedaluwarsa.") message = "Kode OTP telah kedaluwarsa. Silakan minta kode OTP baru.";
        else if (message === "Gagal mereset kata sandi. Pastikan kode OTP benar.") message = "Gagal mereset kata sandi. Pastikan kode OTP yang dimasukkan benar.";

        toast.error(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Mengirim ulang kode OTP ke email pengguna jika belum diterima.
   * 
   * Mengambil alamat email dari lokasi saat ini untuk melakukan permintaan ulang.
   * 
   * @throws Error jika proses pengiriman ulang OTP gagal.
   */
  const handleResend = async () => {
    const email = form.getValues("email");
    if (!email) {
      form.setError("email", { type: "manual", message: "Email wajib diisi untuk kirim ulang OTP" });
      return;
    }

    setIsResending(true);
    try {
      await api.post("/users/password-reset/", { email });
      toast.success("Kode OTP baru telah dikirim ke email Anda.");
    } catch (error: any) {
      const data = error.response?.data;
      const detailError = data?.errors?.detail;
      let message =
        data?.error ||
        (Array.isArray(detailError) ? detailError[0] : detailError) ||
        data?.detail ||
        data?.message ||
        "Gagal mengirim ulang OTP. Silakan coba beberapa saat lagi.";
        
      if (message === "Harap tunggu 3 menit sebelum meminta OTP baru.") message = "Harap tunggu 3 menit sebelum meminta kode OTP baru.";
      else if (message === "Gagal mengirim ulang OTP. Silakan coba beberapa saat lagi.") message = "Gagal mengirim ulang OTP. Silakan coba beberapa saat lagi.";

      toast.error(message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-vanqis-base-layout py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="w-full max-w-[440px] flex justify-start mb-6 sm:absolute sm:top-8 sm:left-12 sm:mb-0">
        <button
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-vanqis-base-text hover:text-vanqis-accent transition-colors outline-none"
          onClick={() => navigate("/forgot-password")}
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
          Kembali
        </button>
      </div>

      <div className="w-full max-w-[440px] bg-vanqis-base-white p-8 sm:p-12 border border-vanqis-base-soft shadow-vanqis-base-text/5 relative">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-16 h-16 bg-vanqis-accent/10 flex items-center justify-center rounded-full mb-6">
             <KeyRound className="w-8 h-8 text-vanqis-accent" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-vanqis-base-text mb-2">
            Reset Sandi
          </h1>
          <p className="text-xs font-bold tracking-widest uppercase text-vanqis-base-text/50">
            Masukkan OTP yang dikirim ke email Anda beserta sandi baru
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-vanqis-base-text/80 mb-2 block">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="rozhak@rozhak.xyz"
                      readOnly
                      className="rounded-none border-vanqis-base-soft focus-visible:ring-1 focus-visible:ring-vanqis-base-text focus-visible:border-vanqis-base-text h-12 text-sm px-4 bg-vanqis-base-layout focus:bg-vanqis-base-white transition-colors hover:border-vanqis-base-text/40 cursor-not-allowed opacity-70"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-[10px] font-medium text-vanqis-fresh-tomato uppercase tracking-wider mt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="otp_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-vanqis-base-text/80 mb-2 block">Kode OTP</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="123456"
                      maxLength={6}
                      inputMode="numeric"
                      className="rounded-none border-vanqis-base-soft focus-visible:ring-1 focus-visible:ring-vanqis-base-text focus-visible:border-vanqis-base-text h-12 text-center text-2xl font-black tracking-[0.5em] px-4 bg-vanqis-base-layout focus:bg-vanqis-base-white transition-colors hover:border-vanqis-base-text/40"
                      {...field}
                      onChange={(e) => {
                        const numericValue = e.target.value.replace(/[^0-9]/g, "");
                        field.onChange(numericValue);
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-[10px] font-medium text-vanqis-fresh-tomato uppercase tracking-wider mt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="new_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-vanqis-base-text/80 mb-2 block">Kata Sandi Baru</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Min. 8 karakter"
                      className="rounded-none border-vanqis-base-soft focus-visible:ring-1 focus-visible:ring-vanqis-base-text focus-visible:border-vanqis-base-text h-12 text-sm px-4 bg-vanqis-base-layout focus:bg-vanqis-base-white transition-colors hover:border-vanqis-base-text/40"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-[10px] font-medium text-vanqis-fresh-tomato uppercase tracking-wider mt-1" />
                </FormItem>
              )}
            />

            <div className="pt-4 space-y-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-none h-14 bg-vanqis-base-text text-vanqis-base-white hover:bg-vanqis-accent transition-colors font-bold uppercase tracking-widest text-xs"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Memverifikasi...
                  </>
                ) : (
                  "Ubah Kata Sandi"
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleResend}
                disabled={isResending}
                className="w-full rounded-none h-14 border border-vanqis-base-soft text-vanqis-base-text hover:bg-vanqis-base-layout transition-colors font-bold uppercase tracking-widest text-xs"
              >
                {isResending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Mengirim Ulang...
                  </>
                ) : (
                  "Kirim Ulang OTP"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ResetPassword;
