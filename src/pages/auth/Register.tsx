import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
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
import { Textarea } from "@/components/ui/textarea";

const registerSchema = z.object({
  username: z.string().min(3, "Username minimal 3 karakter"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  email: z.string().email("Email tidak valid"),
  first_name: z.string().min(1, "Nama depan wajib diisi"),
  last_name: z.string().optional(),
  phone_number: z.string().min(10, "Nomor telepon minimal 10 digit").max(15, "Nomor telepon maksimal 15 digit"),
  address: z.string().min(10, "Alamat lengkap minimal 10 karakter"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      email: "",
      first_name: "",
      last_name: "",
      phone_number: "",
      address: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setIsLoading(true);
    try {
      await api.post("/users/register/", values);
      toast.success("Registrasi berhasil! Silakan login.");
      navigate("/login");
    } catch (error: any) {
      const errors = error.response?.data;
      if (errors) {
        Object.keys(errors).forEach((key) => {
          toast.error(`${key}: ${errors[key][0]}`);
        });
      } else {
        toast.error("Terjadi kesalahan saat registrasi");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-vanqis-base-soft/20 py-12 px-4 sm:px-6 lg:px-8 relative">
      <button 
        className="absolute top-8 left-6 sm:left-12 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-vanqis-base-text hover:text-vanqis-fresh-carrot transition-colors outline-none"
        onClick={() => navigate("/")}
      >
        <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
        Kembali
      </button>

      <div className="w-full max-w-[600px] bg-vanqis-base-white p-8 sm:p-12 border border-vanqis-base-soft shadow-sm mt-8 sm:mt-0">
        <div className="flex flex-col items-center text-center mb-10">
          <h1 className="text-2xl font-black uppercase tracking-tight text-vanqis-base-text mb-2">
            Daftar Akun
          </h1>
          <p className="text-xs font-bold tracking-widest uppercase text-vanqis-base-text/50">
            Lengkapi data diri Anda
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-vanqis-base-text/80 mb-2 block">Nama Depan *</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: Rozhak" className="rounded-none border-vanqis-base-soft focus-visible:ring-1 focus-visible:ring-vanqis-base-text focus-visible:border-vanqis-base-text h-12 text-sm px-4 bg-transparent transition-colors hover:border-vanqis-base-text/40" {...field} />
                    </FormControl>
                    <FormMessage className="text-[10px] font-medium text-vanqis-fresh-tomato uppercase tracking-wider mt-1" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-vanqis-base-text/80 mb-2 block">Nama Belakang</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: Dev" className="rounded-none border-vanqis-base-soft focus-visible:ring-1 focus-visible:ring-vanqis-base-text focus-visible:border-vanqis-base-text h-12 text-sm px-4 bg-transparent transition-colors hover:border-vanqis-base-text/40" value={field.value || ''} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage className="text-[10px] font-medium text-vanqis-fresh-tomato uppercase tracking-wider mt-1" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-vanqis-base-text/80 mb-2 block">Username *</FormLabel>
                    <FormControl>
                      <Input placeholder="rozhak_official" className="rounded-none border-vanqis-base-soft focus-visible:ring-1 focus-visible:ring-vanqis-base-text focus-visible:border-vanqis-base-text h-12 text-sm px-4 bg-transparent transition-colors hover:border-vanqis-base-text/40" {...field} />
                    </FormControl>
                    <FormMessage className="text-[10px] font-medium text-vanqis-fresh-tomato uppercase tracking-wider mt-1" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-vanqis-base-text/80 mb-2 block">Password *</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" className="rounded-none border-vanqis-base-soft focus-visible:ring-1 focus-visible:ring-vanqis-base-text focus-visible:border-vanqis-base-text h-12 text-sm px-4 bg-transparent transition-colors hover:border-vanqis-base-text/40" {...field} />
                    </FormControl>
                    <FormMessage className="text-[10px] font-medium text-vanqis-fresh-tomato uppercase tracking-wider mt-1" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-vanqis-base-text/80 mb-2 block">Email *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="rozhak@rozhak.xyz" className="rounded-none border-vanqis-base-soft focus-visible:ring-1 focus-visible:ring-vanqis-base-text focus-visible:border-vanqis-base-text h-12 text-sm px-4 bg-transparent transition-colors hover:border-vanqis-base-text/40" {...field} />
                  </FormControl>
                  <FormMessage className="text-[10px] font-medium text-vanqis-fresh-tomato uppercase tracking-wider mt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-vanqis-base-text/80 mb-2 block">Nomor WhatsApp *</FormLabel>
                  <FormControl>
                    <Input placeholder="083847921480" className="rounded-none border-vanqis-base-soft focus-visible:ring-1 focus-visible:ring-vanqis-base-text focus-visible:border-vanqis-base-text h-12 text-sm px-4 bg-transparent transition-colors hover:border-vanqis-base-text/40" {...field} />
                  </FormControl>
                  <FormMessage className="text-[10px] font-medium text-vanqis-fresh-tomato uppercase tracking-wider mt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-vanqis-base-text/80 mb-2 block">Alamat Lengkap *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Jl. Merdeka No. 10, RT 02/RW 05..." 
                      className="min-h-[100px] resize-y rounded-none border-vanqis-base-soft focus-visible:ring-1 focus-visible:ring-vanqis-base-text focus-visible:border-vanqis-base-text p-4 text-sm bg-transparent transition-colors hover:border-vanqis-base-text/40"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-[10px] font-medium text-vanqis-fresh-tomato uppercase tracking-wider mt-1" />
                </FormItem>
              )}
            />

            <div className="pt-6">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full rounded-none h-14 bg-vanqis-base-text text-vanqis-base-white hover:bg-vanqis-fresh-carrot transition-colors font-bold uppercase tracking-widest text-xs"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  "Daftar Sekarang"
                )}
              </Button>
            </div>
          </form>
        </Form>

        <div className="mt-8 pt-8 border-t border-vanqis-base-soft text-center">
          <p className="text-xs text-vanqis-base-text/60 font-medium">
            Sudah punya akun?{" "}
            <Link to="/login" className="text-vanqis-base-text font-bold uppercase tracking-widest hover:text-vanqis-fresh-carrot transition-colors ml-1 border-b border-vanqis-base-text hover:border-vanqis-fresh-carrot pb-0.5">
              Masuk Di Sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
