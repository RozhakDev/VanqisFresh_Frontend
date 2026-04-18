import React, { useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import type { Promo } from '@/types';
import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

interface Props {
  promos: Promo[];
}

export default function PromoBanner({ promos }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // Autoplay Manual menggunakan useEffect
  useEffect(() => {
    if (!emblaApi) return;
    
    const intervalId = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [emblaApi]);

  if (!promos || promos.length === 0) return null;

  return (
    <div className="relative group">
      <div className="overflow-hidden rounded-2xl border border-primary/10 bg-accent" ref={emblaRef}>
        <div className="flex">
          {promos.map((promo) => (
            <div key={promo.id} className="flex-[0_0_100%] min-w-0 p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-xl text-accent-foreground leading-tight">
                    {promo.title}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
                    {promo.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {promos.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-background/50 backdrop-blur-sm hidden sm:flex"
            onClick={scrollPrev}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-background/50 backdrop-blur-sm hidden sm:flex"
            onClick={scrollNext}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
          
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {promos.map((_, index) => (
              <div 
                key={index} 
                className="w-1.5 h-1.5 rounded-full bg-primary/20"
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
