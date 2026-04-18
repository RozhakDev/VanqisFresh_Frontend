import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getStoreContacts } from '@/lib/api';
import type { StoreContact } from '@/types';

export default function Footer() {
  const [contacts, setContacts] = useState<StoreContact[]>([]);

  useEffect(() => {
    getStoreContacts().then(res => {
      setContacts(Array.isArray(res) ? res : (res as any).results || []);
    }).catch(() => {});
  }, []);

  const whatsapp = contacts.find(c => c.platform.toLowerCase() === 'whatsapp');
  const instagram = contacts.find(c => c.platform.toLowerCase() === 'instagram');
  const phoneNumber = whatsapp?.account_id || '';

  return (
    <footer className="bg-vanqis-base-white border-t border-vanqis-base-soft mt-24 pb-24 md:pb-12">
      <div className="container-app py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          <div className="lg:col-span-4 space-y-6">
            <Link to="/" className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-vanqis-base-text uppercase leading-none">
                Vanqis<span className="text-vanqis-fresh-carrot">Fresh</span>
              </span>
            </Link>
            <p className="text-vanqis-base-text/70 text-sm leading-relaxed max-w-xs">
              Diambil langsung dari petani lokal di Banjarnegara. Kami mengantarkan produk segar pilihan terbaik langsung ke dapur Anda.
            </p>
            <div className="flex items-center gap-4 pt-4">
              {instagram && (
                <>
                  <a href={instagram.url || '#'} target="_blank" rel="noreferrer" className="text-xs font-bold uppercase tracking-widest text-vanqis-base-text hover:text-vanqis-fresh-carrot transition-colors">
                    Instagram
                  </a>
                  <span className="text-vanqis-base-soft">|</span>
                </>
              )}
              {(whatsapp || (!whatsapp && !instagram)) && (
                <a href={whatsapp?.url || '#'} target="_blank" rel="noreferrer" className="text-xs font-bold uppercase tracking-widest text-vanqis-base-text hover:text-vanqis-fresh-carrot transition-colors">
                  WhatsApp
                </a>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 lg:col-start-7 space-y-6">
            <h4 className="text-vanqis-base-text font-black text-xs uppercase tracking-widest">Belanja</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="text-vanqis-base-text/70 hover:text-vanqis-base-text transition-colors">Katalog</Link></li>
              <li><Link to="/cart" className="text-vanqis-base-text/70 hover:text-vanqis-base-text transition-colors">Keranjang</Link></li>
              <li><Link to="/orders" className="text-vanqis-base-text/70 hover:text-vanqis-base-text transition-colors">Pesanan</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <h4 className="text-vanqis-base-text font-black text-xs uppercase tracking-widest">Bantuan</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="text-vanqis-base-text/70 hover:text-vanqis-base-text transition-colors">Tanya Jawab</a></li>
              <li><a href={whatsapp?.url || '#'} className="text-vanqis-base-text/70 hover:text-vanqis-base-text transition-colors">Hubungi Kami</a></li>
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <h4 className="text-vanqis-base-text font-black text-xs uppercase tracking-widest">Lokasi</h4>
            <ul className="space-y-3 text-sm text-vanqis-base-text/70 leading-relaxed">
              <li>JM24+P87, Blater</li>
              <li>Pucang, Kec. Bawang</li>
              <li>Kab. Banjarnegara</li>
              <li>Jawa Tengah 53471</li>
            </ul>
          </div>

        </div>

        <div className="border-t border-vanqis-base-soft mt-20 pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-[10px] font-bold text-vanqis-base-text/40 uppercase tracking-widest">
            &copy; {new Date().getFullYear()} VanqisStore. Hak Cipta Dilindungi.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-[10px] font-bold text-vanqis-base-text uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-vanqis-fresh-carrot animate-pulse"></span>
              Segar Setiap Hari
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
