import { MapPin, User, Phone, Edit2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  user: any;
}

/**
 * Menampilkan informasi pengiriman dari profil pengguna.
 *
 * @param user - Objek data profil pengguna.
 * @returns Komponen kartu informasi pengiriman.
 */
export default function DeliveryInfo({ user }: Props) {
  const navigate = useNavigate();

  return (
    <section>
      {/* Header Info */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-black uppercase tracking-widest text-vanqis-base-text flex items-center gap-2">
          <MapPin className="w-4 h-4" /> Informasi Pengiriman
        </h2>
        <button onClick={() => navigate('/profile')} className="text-[10px] font-bold uppercase tracking-widest text-vanqis-base-text/60 hover:text-vanqis-accent transition-colors flex items-center gap-1 outline-none">
          <Edit2 className="w-3 h-3" /> Ubah
        </button>
      </div>
      
      {/* Kartu Detail */}
      <div className="bg-vanqis-base-white border border-vanqis-base-soft p-6">
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-4">
            {/* Info Penerima */}
            <div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-vanqis-base-text/50 mb-1 flex items-center gap-1.5"><User className="w-3 h-3" /> Penerima</span>
              <p className="font-bold text-sm text-vanqis-base-text">{user?.first_name} {user?.last_name}</p>
            </div>
            {/* Info Kontak */}
            <div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-vanqis-base-text/50 mb-1 flex items-center gap-1.5"><Phone className="w-3 h-3" /> Nomor WhatsApp</span>
              <p className="font-bold text-sm text-vanqis-base-text">{user?.phone_number}</p>
            </div>
          </div>
          {/* Info Alamat */}
          <div>
            <span className="text-[9px] font-bold uppercase tracking-widest text-vanqis-base-text/50 mb-1">Alamat Lengkap</span>
            <p className="text-sm leading-relaxed text-vanqis-base-text/80">{user?.address}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
