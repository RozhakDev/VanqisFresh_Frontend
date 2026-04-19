import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuthStore } from "@/stores/auth";
import { ArrowLeft, Loader2, Save, User as UserIcon } from "lucide-react";

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
  email: z.string().trim().email("Email tidak valid").or(z.literal('')),
  first_name: z.string().trim().min(1, "Nama depan wajib diisi"),
  last_name: z.string().optional().nullable(),
  phone_number: z.string().trim().regex(/^\d+$/, "Nomor telepon hanya boleh angka").min(10, "Nomor telepon minimal 10 digit").max(15, "Nomor telepon maksimal 15 digit"),
  address: z.string().trim().min(10, "Alamat lengkap minimal 10 karakter"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function Profile() {
  const navigate = useNavigate();
  const { user, fetchProfile } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

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

  const onSubmit = async (values: ProfileFormValues) => {
    setIsLoading(true);
    try {
      await api.patch("/users/profile/", values);
      await fetchProfile();
      toast.success("Profil berhasil diperbarui!");
    } catch (error: any) {
      const errors = error.response?.data;
      if (errors && typeof errors === 'object') {
        Object.keys(errors).forEach((key) => {
          if (Array.isArray(errors[key])) {
            toast.error(`${key}: ${errors[key][0]}`);
          }
        });
      } else {
        toast.error("Terjadi kesalahan saat memperbarui profil");
      }
    } finally {
      setIsLoading(false);
    }
  };
return (
  <div className="container-app py-8 max-w-3xl mx-auto px-4">
    <button 
      className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-vanqis-base-text hover:text-vanqis-fresh-carrot transition-colors mb-8 outline-none"
      onClick={() => navigate("/")}
    >
      <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
      Kembali ke Beranda
    </button>

    <div className="bg-vanqis-base-white border border-vanqis-base-soft p-8 md:p-12 relative overflow-hidden shadow-vanqis-base-text/5">
      {/* Decorative corner element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-vanqis-base-soft/20 rounded-bl-[100px] -z-10" />
        
        <div className="flex items-center gap-6 mb-10 pb-8 border-b border-vanqis-base-soft">
          <div className="w-20 h-20 bg-vanqis-base-text text-vanqis-base-white flex items-center justify-center text-3xl font-black rounded-none shadow-sm shrink-0">
            {user?.first_name?.charAt(0).toUpperCase() || <UserIcon className="w-10 h-10" />}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-vanqis-base-text mb-1">Profil Saya</h1>
            <p className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-vanqis-base-text/50">Kelola data diri & alamat pengiriman</p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-vanqis-base-text/70 mb-1 block">Nama Depan *</FormLabel>
                    <FormControl>
                      <Input placeholder="Rozhak" className="rounded-none border-vanqis-base-soft focus-visible:ring-1 focus-visible:ring-vanqis-base-text focus-visible:border-vanqis-base-text h-12 text-sm px-4 bg-vanqis-base-layout focus:bg-vanqis-base-white transition-colors hover:border-vanqis-base-text/40" {...field} />
                    </FormControl>
                    <FormMessage className="text-xs text-vanqis-fresh-tomato" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-vanqis-base-text/70 mb-1 block">Nama Belakang</FormLabel>
                    <FormControl>
                      <Input placeholder="Dev" className="rounded-none border-vanqis-base-soft focus-visible:ring-1 focus-visible:ring-vanqis-base-text focus-visible:border-vanqis-base-text h-12 text-sm px-4 bg-vanqis-base-layout focus:bg-vanqis-base-white transition-colors hover:border-vanqis-base-text/40" value={field.value || ''} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage className="text-xs text-vanqis-fresh-tomato" />
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
                    <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-vanqis-base-text/70 mb-1 block">Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="rozhak@rozhak.xyz" className="rounded-none border-vanqis-base-soft focus-visible:ring-1 focus-visible:ring-vanqis-base-text focus-visible:border-vanqis-base-text h-12 text-sm px-4 bg-vanqis-base-layout focus:bg-vanqis-base-white transition-colors hover:border-vanqis-base-text/40" {...field} />
                    </FormControl>
                    <FormMessage className="text-xs text-vanqis-fresh-tomato" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-vanqis-base-text/70 mb-1 block">Nomor WhatsApp *</FormLabel>
                    <FormControl>
                      <Input placeholder="083847921480" className="rounded-none border-vanqis-base-soft focus-visible:ring-1 focus-visible:ring-vanqis-base-text focus-visible:border-vanqis-base-text h-12 text-sm px-4 bg-vanqis-base-layout focus:bg-vanqis-base-white transition-colors hover:border-vanqis-base-text/40" {...field} />
                    </FormControl>
                    <FormMessage className="text-xs text-vanqis-fresh-tomato" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
               <FormItem>
                  <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-vanqis-base-text/70 mb-1 block">Alamat Lengkap *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Detail alamat untuk pengiriman..." 
                      className="min-h-[120px] resize-y rounded-none border-vanqis-base-soft focus-visible:ring-1 focus-visible:ring-vanqis-base-text focus-visible:border-vanqis-base-text p-4 text-sm bg-vanqis-base-layout focus:bg-vanqis-base-white transition-colors hover:border-vanqis-base-text/40"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-vanqis-fresh-tomato" />
                </FormItem>
              )}
            />

            <div className="pt-8 border-t border-vanqis-base-soft mt-8">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full sm:w-auto rounded-none h-12 px-8 bg-vanqis-base-text text-vanqis-base-white hover:bg-vanqis-fresh-carrot transition-colors font-bold uppercase tracking-widest text-xs"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Simpan Perubahan
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
