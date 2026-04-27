import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuthStore } from "@/stores/auth";
import { ArrowLeft, Loader2, Save, User as UserIcon, LogOut } from "lucide-react";

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

const profileSchema = z.object({
  email: z.string().trim().min(1, "Email wajib diisi").email("Email tidak valid"),
  first_name: z.string().trim().min(1, "Nama depan wajib diisi"),
  last_name: z.string().optional().nullable(),
  phone_number: z.string().trim().regex(/^\d+$/, "Nomor telepon hanya boleh angka").min(10, "Nomor telepon minimal 10 digit").max(15, "Nomor telepon maksimal 15 digit"),
  address: z.string().trim().min(10, "Alamat lengkap minimal 10 karakter"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

/**
 * Menampilkan formulir profil pengguna untuk pembaruan data diri.
 *
 * @returns Halaman profil.
 */
export default function Profile() {
  const navigate = useNavigate();
  const { user, fetchProfile, logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      email: "",
      first_name: "",
      last_name: "",
      phone_number: "",
      address: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        email: user.email || "",
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        phone_number: user.phone_number || "",
        address: user.address || "",
      });
    }
  }, [user, form]);

  /**
   * Mengirim perubahan profil ke server lalu memuat ulang data pengguna.
   *
   * @param values - Data profil yang telah divalidasi.
   */
  const onSubmit = async (values: ProfileFormValues) => {
    setIsLoading(true);
    try {
      await api.patch("/users/profile/", values);
      await fetchProfile();
      toast.success("Profil berhasil diperbarui!");
    } catch (error: any) {
      const errors = error.response?.data?.errors;
      if (errors && typeof errors === 'object') {
        Object.keys(errors).forEach((key) => {
          form.setError(key as any, {
            type: "manual",
            message: errors[key][0],
          });
        });
      } else {
        toast.error("Terjadi kesalahan saat memperbarui profil");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-app py-8 max-w-3xl mx-auto px-4 text-vanqis-base-text">
      {/* Tombol Kembali */}
      <button 
        className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-vanqis-accent transition-colors mb-8 outline-none"
        onClick={() => navigate("/")}
      >
        <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
        Kembali ke Beranda
      </button>

      {/* Kontainer Profil */}
      <div className="bg-vanqis-base-white border border-vanqis-base-soft relative overflow-hidden shadow-vanqis-base-text/5 flex flex-col">
        {/* Header Profil */}
        <div className="p-8 md:p-12 pb-0">
          <div className="flex items-center gap-6 mb-10 pb-8 border-b border-vanqis-base-soft">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-vanqis-base-text text-vanqis-base-white flex items-center justify-center text-2xl sm:text-3xl font-black shrink-0">
              {user?.first_name?.charAt(0).toUpperCase() || <UserIcon className="w-8 h-8" />}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-3xl font-black uppercase tracking-tight truncate">Profil Saya</h1>
              <p className="text-[10px] sm:text-xs font-bold tracking-widest uppercase opacity-50 truncate">Kelola data diri & pengiriman</p>
            </div>
          </div>

          {/* Form Utama */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1 block">Nama Depan *</FormLabel>
                      <FormControl>
                        <Input placeholder="Contoh: Vanqis" className="rounded-none border-vanqis-base-soft focus-visible:ring-1 focus-visible:ring-vanqis-base-text h-12 text-sm px-4 bg-vanqis-base-layout focus:bg-vanqis-base-white" {...field} />
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
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1 block">Nama Belakang</FormLabel>
                      <FormControl>
                        <Input placeholder="Contoh: Fresh" className="rounded-none border-vanqis-base-soft focus-visible:ring-1 focus-visible:ring-vanqis-base-text h-12 text-sm px-4 bg-vanqis-base-layout focus:bg-vanqis-base-white" value={field.value || ''} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage className="text-[10px] font-medium text-vanqis-fresh-tomato uppercase tracking-wider mt-1" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1 block">Email *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Contoh: user@vanqisfresh.com" className="rounded-none border-vanqis-base-soft focus-visible:ring-1 focus-visible:ring-vanqis-base-text h-12 text-sm px-4 bg-vanqis-base-layout focus:bg-vanqis-base-white" {...field} />
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
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1 block">Nomor WhatsApp *</FormLabel>
                      <FormControl>
                        <Input placeholder="Contoh: 08xxxxxxxxxx" className="rounded-none border-vanqis-base-soft focus-visible:ring-1 focus-visible:ring-vanqis-base-text h-12 text-sm px-4 bg-vanqis-base-layout focus:bg-vanqis-base-white" {...field} />
                      </FormControl>
                      <FormMessage className="text-[10px] font-medium text-vanqis-fresh-tomato uppercase tracking-wider mt-1" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1 block">Alamat Lengkap *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Contoh: Jl. Melati No. 10, Bandung" 
                        className="min-h-[120px] resize-y rounded-none border-vanqis-base-soft focus-visible:ring-1 focus-visible:ring-vanqis-base-text p-4 text-sm bg-vanqis-base-layout focus:bg-vanqis-base-white"
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
                  className="w-full rounded-none h-14 bg-vanqis-base-text text-vanqis-base-white hover:bg-vanqis-accent transition-colors font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Simpan Perubahan
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>

        {/* Footer Card - Logout Section */}
        <div className="bg-vanqis-base-layout/30 p-8 md:p-12 border-t border-vanqis-base-soft flex justify-center">
          <button 
            onClick={handleLogout}
            className="w-full sm:w-auto px-10 h-14 border-2 border-vanqis-fresh-tomato text-vanqis-fresh-tomato hover:bg-vanqis-fresh-tomato hover:text-vanqis-base-white transition-all font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 group outline-none"
          >
            <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" strokeWidth={3} />
            Keluar dari Akun
          </button>
        </div>
      </div>
    </div>
  );
}
