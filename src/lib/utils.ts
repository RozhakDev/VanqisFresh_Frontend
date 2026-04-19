import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Menggabungkan daftar class CSS dan menyederhanakan konflik Tailwind.
 *
 * @param inputs - Daftar nilai class yang akan digabungkan.
 * @returns Class string final yang sudah dinormalisasi.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Memformat nilai angka menjadi rupiah dengan gaya lokal Indonesia.
 *
 * @param price - Nilai harga mentah yang akan diformat.
 * @returns Teks harga dalam format IDR.
 */
export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};
