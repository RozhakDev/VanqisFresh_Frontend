import type { Promo } from '@/types';
import { Sparkles } from 'lucide-react';

interface Props {
  promos: Promo[];
}

export default function PromoBanner({ promos }: Props) {
  if (!promos.length) return null;
  const promo = promos[0];

  return (
    <div className="bg-accent rounded-2xl p-6 border border-primary/10">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-accent-foreground" />
        </div>
        <div>
          <h3 className="font-bold text-accent-foreground mb-1">{promo.title}</h3>
          <p className="text-sm text-muted-foreground">{promo.description}</p>
        </div>
      </div>
    </div>
  );
}
