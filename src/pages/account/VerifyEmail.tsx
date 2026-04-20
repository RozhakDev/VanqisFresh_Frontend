import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import api from "@/lib/api";
import { Loader2, ArrowLeft, MailCheck } from "lucide-react";

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

const verifySchema = z.object({
  email: z.string().email("Email tidak valid"),
  otp_code: z.string().min(6, "Kode OTP minimal 6 digit"),
});

type VerifyFormValues = z.infer<typeof verifySchema>;

/**
 * Menyajikan formulir untuk verifikasi email setelah pendaftaran.
 *
 * @returns Halaman verifikasi email.
 */
const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  
  const defaultEmail = location.state?.email || "";

  const form = useForm<VerifyFormValues>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      email: defaultEmail,
      otp_code: "",
    },
  });

  const onSubmit = async (values: VerifyFormValues) => {
    setIsLoading(true);
    try {
      await api.post("/users/verify-email/", values);
      toast.success("Verifikasi berhasil! Silakan masuk.");
      navigate("/login");
    } catch (error: any) {
      const message = error.response?.data?.error || "Kode OTP tidak valid atau kedaluwarsa.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    const email = form.getValues("email");
    if (!email) {
      form.setError("email", { type: "manual", message: "Email wajib diisi untuk kirim ulang OTP" });
      return;
    }
    
    setIsResending(true);
    try {
      await api.post("/users/resend-otp/", { email });
      toast.success("Kode OTP baru telah dikirim ke email Anda.");
    } catch (error: any) {
      const message = error.response?.data?.error || "Gagal mengirim ulang OTP. Silakan coba beberapa saat lagi.";
      toast.error(message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-vanqis-base-layout py-12 px-4 sm:px-6 lg:px-8 relative">
      <button 
        className="absolute top-8 left-6 sm:left-12 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-vanqis-base-text hover:text-vanqis-accent transition-colors outline-none"
        onClick={() => navigate("/login")}
      >
        <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
        Kembali ke Login
      </button>

      <div className="w-full max-w-[440px] bg-vanqis-base-white p-8 sm:p-12 border border-vanqis-base-soft shadow-vanqis-base-text/5 relative">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-16 h-16 bg-vanqis-accent/10 flex items-center justify-center rounded-full mb-6">
             <MailCheck className="w-8 h-8 text-vanqis-accent" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-vanqis-base-text mb-2">
            Verifikasi Email
          </h1>
          <p className="text-xs font-bold tracking-widest uppercase text-vanqis-base-text/50">
            Masukkan kode OTP yang dikirim ke email Anda
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
                      className="rounded-none border-vanqis-base-soft focus-visible:ring-1 focus-visible:ring-vanqis-base-text focus-visible:border-vanqis-base-text h-12 text-sm px-4 bg-vanqis-base-layout focus:bg-vanqis-base-white transition-colors hover:border-vanqis-base-text/40" 
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
                      className="rounded-none border-vanqis-base-soft focus-visible:ring-1 focus-visible:ring-vanqis-base-text focus-visible:border-vanqis-base-text h-12 text-center text-2xl font-black tracking-[0.5em] px-4 bg-vanqis-base-layout focus:bg-vanqis-base-white transition-colors hover:border-vanqis-base-text/40" 
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
                  "Verifikasi Akun"
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

export default VerifyEmail;
