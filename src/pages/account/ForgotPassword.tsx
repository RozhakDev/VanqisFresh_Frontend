import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth";
import api from "@/lib/api";
import { Loader2, ArrowLeft } from "lucide-react";

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

const requestSchema = z.object({
  email: z.string().email("Email tidak valid"),
});

/**
 * Merepresentasikan data formulir untuk meminta kode OTP.
 * 
 * Digunakan untuk menangani input email pengguna saat lupa kata sandi.
 */
type RequestFormValues = z.infer<typeof requestSchema>;

/**
 * Menyajikan halaman lupa kata sandi.
 * 
 * Menangani proses pengisian email untuk meminta kode OTP pemulihan.
 * 
 * @returns Elemen halaman untuk meminta OTP.
 */
const ForgotPassword = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      toast.info("Anda sudah masuk ke akun.");
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const requestForm = useForm<RequestFormValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: { email: "" },
  });

  /**
   * Mengirim permintaan OTP ke server menggunakan email yang dimasukkan.
   * 
   * Jika berhasil, pengguna akan diarahkan ke halaman reset kata sandi.
   * 
   * @param values - Data formulir berisi email pengguna.
   * @throws Error jika proses pengiriman gagal.
   */
  const onRequestSubmit = async (values: RequestFormValues) => {
    setIsLoading(true);
    try {
      const response = await api.post("/users/password-reset/", {
        email: values.email,
      });
      toast.success(response.data?.message || "Kode OTP reset kata sandi telah dikirim ke email Anda.");
      navigate("/reset-password", { state: { email: values.email } });
    } catch (error: any) {
      const data = error.response?.data;
      if (data?.email) {
        requestForm.setError("email", { type: "server", message: data.email[0] || data.email });
      } else if (data?.errors?.email) {
        requestForm.setError("email", { type: "server", message: data.errors.email[0] || data.errors.email });
      } else {
        const detailError = data?.errors?.detail;
        let message =
          data?.error ||
          (Array.isArray(detailError) ? detailError[0] : detailError) ||
          data?.detail ||
          data?.message ||
          "Gagal mengirim OTP. Pastikan email yang dimasukkan sudah benar.";
          
        if (message === "Pengguna dengan email ini tidak ditemukan.") {
          message = "Alamat email tidak terdaftar di sistem kami.";
        }
        
        toast.error(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-vanqis-base-layout py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="w-full max-w-[440px] flex justify-start mb-6 sm:absolute sm:top-8 sm:left-12 sm:mb-0">
        <button
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-vanqis-base-text hover:text-vanqis-accent transition-colors outline-none"
          onClick={() => navigate("/login")}
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
          Kembali ke Login
        </button>
      </div>

      <div className="w-full max-w-[440px] bg-vanqis-base-white p-8 sm:p-12 border border-vanqis-base-soft shadow-vanqis-base-text/5 relative">
        <div className="flex flex-col items-center text-center mb-10">
          <h1 className="text-2xl font-black uppercase tracking-tight text-vanqis-base-text mb-2">
            Lupa Sandi
          </h1>
          <p className="text-xs font-bold tracking-widest uppercase text-vanqis-base-text/50">
            Masukkan email untuk mengatur ulang sandi Anda
          </p>
        </div>

        <Form {...requestForm}>
          <form onSubmit={requestForm.handleSubmit(onRequestSubmit)} className="space-y-6">
            <FormField
              control={requestForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-vanqis-base-text/80 mb-2 block">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Contoh: user@vanqisfresh.com"
                      className="rounded-none border-vanqis-base-soft focus-visible:ring-1 focus-visible:ring-vanqis-base-text focus-visible:border-vanqis-base-text h-12 text-sm px-4 bg-vanqis-base-layout focus:bg-vanqis-base-white transition-colors hover:border-vanqis-base-text/40"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-[10px] font-medium text-vanqis-fresh-tomato uppercase tracking-wider mt-1" />
                </FormItem>
              )}
            />
            <div className="pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-none h-14 bg-vanqis-base-text text-vanqis-base-white hover:bg-vanqis-accent transition-colors font-bold uppercase tracking-widest text-xs"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  "Kirim OTP"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ForgotPassword;
