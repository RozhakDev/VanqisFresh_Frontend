import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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

const loginSchema = z.object({
  username: z.string().min(1, "Username wajib diisi"),
  password: z.string().min(1, "Password wajib diisi"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    try {
      const response = await api.post("/users/login/", values);
      const { access, refresh } = response.data;
      
      await login(access, refresh);
      toast.success("Login berhasil!");
      navigate("/");
    } catch (error: any) {
      const message = error.response?.data?.detail || "Username atau password salah";
      toast.error(message);
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

      <div className="w-full max-w-[440px] bg-vanqis-base-white p-8 sm:p-12 border border-vanqis-base-soft shadow-sm">
        <div className="flex flex-col items-center text-center mb-10">
          <h1 className="text-2xl font-black uppercase tracking-tight text-vanqis-base-text mb-2">
            Masuk Akun
          </h1>
          <p className="text-xs font-bold tracking-widest uppercase text-vanqis-base-text/50">
            Selamat datang kembali di VanqisFresh
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-vanqis-base-text/80 mb-2 block">Username</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Contoh: rozhak_official" 
                      className="rounded-none border-vanqis-base-soft focus-visible:ring-1 focus-visible:ring-vanqis-base-text focus-visible:border-vanqis-base-text h-12 text-sm px-4 bg-transparent transition-colors hover:border-vanqis-base-text/40" 
                      {...field} 
                    />
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
                  <div className="flex items-center justify-between mb-2">
                    <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-vanqis-base-text/80 block">Password</FormLabel>
                  </div>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      className="rounded-none border-vanqis-base-soft focus-visible:ring-1 focus-visible:ring-vanqis-base-text focus-visible:border-vanqis-base-text h-12 text-sm px-4 bg-transparent transition-colors hover:border-vanqis-base-text/40" 
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
                className="w-full rounded-none h-14 bg-vanqis-base-text text-vanqis-base-white hover:bg-vanqis-fresh-carrot transition-colors font-bold uppercase tracking-widest text-xs"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Memverifikasi...
                  </>
                ) : (
                  "Masuk Sekarang"
                )}
              </Button>
            </div>
          </form>
        </Form>

        <div className="mt-8 pt-8 border-t border-vanqis-base-soft text-center">
          <p className="text-xs text-vanqis-base-text/60 font-medium">
            Belum punya akun?{" "}
            <Link to="/register" className="text-vanqis-base-text font-bold uppercase tracking-widest hover:text-vanqis-fresh-carrot transition-colors ml-1 border-b border-vanqis-base-text hover:border-vanqis-fresh-carrot pb-0.5">
              Daftar Di Sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
