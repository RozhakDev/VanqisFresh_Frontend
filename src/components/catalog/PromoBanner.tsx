import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import type { Promo } from '@/types';
import { ArrowRight, ChevronLeft, ChevronRight, Package, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { useIsMobile } from '@/hooks/use-mobile';
import ProductCard from '@/components/catalog/ProductCard';

interface Props {
  promos: Promo[];
}

/**
 * Menampilkan banner promo bergulir dengan kontrol navigasi.
 *
 * @param promos - Daftar promo yang akan ditampilkan.
 * @returns Banner promosi atau `null` bila tidak ada data.
 */
export default function PromoBanner({ promos }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedPromo, setSelectedPromo] = useState<Promo | null>(null);
  const isMobile = useIsMobile();

  /**
   * Menggeser slider ke item promo sebelumnya.
   */
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  /**
   * Menggeser slider ke item promo berikutnya.
   */
  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    
    const intervalId = setInterval(() => {
      emblaApi.scrollNext();
    }, 6000);

    return () => clearInterval(intervalId);
  }, [emblaApi]);

  if (!promos || promos.length === 0) return null;

  const promoColors = [
    "bg-vanqis-accent text-vanqis-base-white",
    "bg-vanqis-base-text text-vanqis-base-white",
    "bg-vanqis-fresh-tomato text-vanqis-base-white",
    "bg-vanqis-fresh-grape text-vanqis-base-white",
  ];

  return (
    <>
      <div className="relative group w-full mb-8">
        {/* Slider Promo */}
        <div className="overflow-hidden border border-vanqis-base-soft" ref={emblaRef}>
          <div className="flex">
            {promos.map((promo, index) => {
              const colorClass = promoColors[index % promoColors.length];
              return (
                <div 
                  key={promo.id} 
                  className={cn(
                    "flex-[0_0_100%] min-w-0 p-8 sm:p-12 md:p-16 flex flex-col justify-center min-h-[240px] md:min-h-[320px] transition-colors",
                    colorClass
                  )}
                >
                  <div className="max-w-2xl space-y-4">
                    <div className="inline-block px-3 py-1 border border-current text-[10px] font-bold uppercase tracking-widest mb-2">
                      Special Offer
                    </div>
                    <h3 className="font-black text-3xl md:text-5xl leading-[1.1] tracking-tight">
                      {promo.title}
                    </h3>
                    <p className="text-sm md:text-base font-medium opacity-90 leading-relaxed max-w-xl">
                      {promo.description}
                    </p>
                    <div className="pt-4">
                      <button 
                        onClick={() => setSelectedPromo(promo)}
                        className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:gap-4 transition-all duration-300 outline-none"
                      >
                        Shop Now <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {promos.length > 1 && (
          <>
            {/* Navigasi */}
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-vanqis-base-white/10 backdrop-blur-md border border-vanqis-base-white/20 text-vanqis-base-white hover:bg-vanqis-base-white hover:text-vanqis-base-text transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0"
              onClick={scrollPrev}
              aria-label="Previous promo"
            >
              <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
            </button>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-vanqis-base-white/10 backdrop-blur-md border border-vanqis-base-white/20 text-vanqis-base-white hover:bg-vanqis-base-white hover:text-vanqis-base-text transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0"
              onClick={scrollNext}
              aria-label="Next promo"
            >
              <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
            </button>
            
            <div className="absolute bottom-6 left-8 sm:left-12 md:left-16 flex gap-2">
              {promos.map((_, index) => (
                <div 
                  key={index} 
                  className="w-8 h-0.5 bg-vanqis-base-white/30"
                />
              ))}
            </div>
          </>
        )}
      </div>

      {isMobile ? (
        <Drawer open={!!selectedPromo} onOpenChange={(open) => !open && setSelectedPromo(null)}>
          <DrawerContent className="border-vanqis-base-soft bg-vanqis-base-layout p-0 flex flex-col rounded-none overflow-hidden max-h-[85vh]">
            <DrawerHeader className="p-6 border-b border-vanqis-base-soft bg-vanqis-base-white text-left pt-8">
              <DrawerTitle className="text-xl font-black uppercase tracking-tight text-vanqis-base-text leading-tight">
                {selectedPromo?.title}
              </DrawerTitle>
              <DrawerDescription className="text-xs font-medium text-vanqis-base-text/70 mt-1.5">
                {selectedPromo?.description}
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-6 flex-1 overflow-y-auto">
              {selectedPromo?.products && selectedPromo.products.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {selectedPromo.products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-12 px-4 h-full opacity-50">
                  <Package className="w-12 h-12 text-vanqis-base-text mb-4" strokeWidth={1} />
                  <p className="text-sm font-bold uppercase tracking-widest text-vanqis-base-text">
                    Tidak ada produk
                  </p>
                  <p className="text-xs mt-2">Promo ini tidak memiliki produk aktif saat ini.</p>
                </div>
              )}
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Sheet open={!!selectedPromo} onOpenChange={(open) => !open && setSelectedPromo(null)}>
          <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto border-vanqis-base-soft bg-vanqis-base-layout p-0 flex flex-col">
            <SheetHeader className="p-6 border-b border-vanqis-base-soft bg-vanqis-base-white sticky top-0 z-10 text-left">
              <SheetTitle className="text-xl font-black uppercase tracking-tight text-vanqis-base-text leading-tight">
                {selectedPromo?.title}
              </SheetTitle>
              <SheetDescription className="text-xs font-medium text-vanqis-base-text/70 mt-1.5">
                {selectedPromo?.description}
              </SheetDescription>
            </SheetHeader>
            <div className="p-6 flex-1">
              {selectedPromo?.products && selectedPromo.products.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {selectedPromo.products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-12 px-4 h-full opacity-50">
                  <Package className="w-12 h-12 text-vanqis-base-text mb-4" strokeWidth={1} />
                  <p className="text-sm font-bold uppercase tracking-widest text-vanqis-base-text">
                    Tidak ada produk
                  </p>
                  <p className="text-xs mt-2">Promo ini tidak memiliki produk aktif saat ini.</p>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
