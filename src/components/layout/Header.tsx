import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, User, LogOut, History, Home, Package } from 'lucide-react';
import { useCart } from '@/stores/cart';
import { useAuthStore } from '@/stores/auth';
import { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';

/**
 * Menampilkan header global, pencarian, akun, dan navigasi bawah pada mobile.
 * Dirancang dengan estetika editorial premium.
 *
 * @returns Komponen header aplikasi.
 */
export default function Header() {
  const totalItems = useCart(s => s.totalItems());
  const { user, isAuthenticated, logout } = useAuthStore();
  const [search, setSearch] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/?search=${encodeURIComponent(search.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header className={cn(
        "sticky top-0 z-50 w-full bg-vanqis-base-white transition-shadow duration-300",
        scrolled ? "shadow-[0_1px_10px_rgba(0,0,0,0.05)]" : ""
      )}>
        {/* Logo & Aksi */}
        <div className="container-app h-14 md:h-20 flex items-center justify-between gap-4">
          
          {/* Logo Merek */}
          <Link to="/" className="flex items-center shrink-0 group">
            <span className="text-lg md:text-2xl font-black tracking-tight text-vanqis-base-text uppercase leading-none">
              Vanqis<span className="text-vanqis-accent transition-colors duration-500">Fresh</span>
            </span>
          </Link>

          {/* Pencarian Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-vanqis-base-text/40" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari produk segar..."
              className="w-full h-11 pl-10 pr-4 bg-transparent border border-vanqis-base-soft text-vanqis-base-text placeholder:text-vanqis-base-text/40 rounded-none focus:outline-none focus:border-vanqis-accent transition-colors text-sm"
            />
            <button type="submit" className="absolute right-0 top-0 bottom-0 px-6 bg-vanqis-base-text text-vanqis-base-white text-xs font-bold uppercase tracking-wider hover:bg-vanqis-accent transition-colors">
              Cari
            </button>
          </form>

          {/* Tindakan Desktop/Tablet */}
          <div className="hidden md:flex items-center gap-6 shrink-0">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 group outline-none">
                  <div className="relative">
                    <User className="w-5 h-5 text-vanqis-base-text group-hover:text-vanqis-accent transition-colors" strokeWidth={1.5} />
                  </div>
                  <div className="hidden lg:flex flex-col text-left">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-vanqis-base-text/50 mb-0.5">
                      Akun Saya
                    </span>
                    <span className="text-xs font-black uppercase tracking-widest text-vanqis-base-text group-hover:text-vanqis-accent transition-colors">
                      {user?.first_name}
                    </span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 rounded-none border-vanqis-base-soft shadow-xl" align="end">
                  <DropdownMenuLabel className="font-normal p-3">
                    <p className="text-sm font-bold text-vanqis-base-text">{user?.first_name} {user?.last_name}</p>
                    <p className="text-xs text-vanqis-base-text/50">@{user?.username}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-vanqis-base-soft" />
                  <DropdownMenuItem onClick={() => navigate('/profile')} className="rounded-none cursor-pointer focus:bg-vanqis-base-soft focus:text-vanqis-base-text py-2.5">
                    <User className="mr-2 h-4 w-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Profil Saya</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-vanqis-base-soft" />
                  <DropdownMenuItem onClick={() => navigate('/orders')} className="rounded-none cursor-pointer focus:bg-vanqis-base-soft focus:text-vanqis-base-text py-2.5">
                    <History className="mr-2 h-4 w-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Pesanan</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-vanqis-base-soft" />
                  <DropdownMenuItem onClick={handleLogout} className="rounded-none cursor-pointer text-vanqis-fresh-tomato focus:bg-vanqis-fresh-tomato/10 focus:text-vanqis-fresh-tomato py-2.5">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Keluar</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login" className="text-xs font-bold uppercase tracking-widest text-vanqis-base-text hover:text-vanqis-accent transition-colors">
                Masuk
              </Link>
            )}

            <Link to="/cart" className="flex items-center gap-2 group">
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-vanqis-base-text group-hover:text-vanqis-accent transition-colors" strokeWidth={1.5} />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-vanqis-accent text-vanqis-base-white text-[9px] font-bold flex items-center justify-center rounded-full border border-vanqis-base-white transition-colors duration-500">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-vanqis-base-text hidden lg:block group-hover:text-vanqis-accent transition-colors">
                Keranjang
              </span>
            </Link>
          </div>

          {/* Tindakan Kanan Seluler */}
          <div className="flex md:hidden items-center">
            <Link to="/cart" className="relative p-2 outline-none active:scale-90 transition-transform">
              <ShoppingCart className="w-5.5 h-5.5 text-vanqis-base-text" strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className="absolute top-1 right-0.5 w-4 h-4 bg-vanqis-accent text-vanqis-base-white text-[9px] font-black flex items-center justify-center rounded-none shadow-sm transition-colors duration-500">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>
          </div>

        </div>

        {/* Pencarian Seluler */}
        <div className="md:hidden px-4 pb-3 bg-vanqis-base-white">
          <form onSubmit={handleSearch} className="relative flex items-center">
            <div className="absolute left-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-vanqis-base-text/30" />
            </div>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari produk segar hari ini..."
              className="w-full h-10 pl-9 pr-4 bg-vanqis-base-soft/40 border-none text-vanqis-base-text placeholder:text-vanqis-base-text/30 focus:outline-none text-sm font-medium transition-all"
            />
          </form>
        </div>
      </header>

      {/* Navigasi Bawah */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-vanqis-base-white border-t border-vanqis-base-soft flex items-center justify-between px-6 py-3 pb-safe">
        <Link to="/" className={cn(
          "flex flex-col items-center gap-1 transition-all duration-300 relative px-4 py-1",
          isActive('/') ? "text-vanqis-accent" : "text-vanqis-base-text/40"
        )}>
          {isActive('/') && <div className="absolute inset-0 bg-vanqis-accent-soft rounded-xl -z-10" />}
          <Home className="w-5 h-5" strokeWidth={isActive('/') ? 2.5 : 1.5} />
          <span className="text-[9px] font-black uppercase tracking-wider">Beranda</span>
        </Link>
        
        <Link to="/orders" className={cn(
          "flex flex-col items-center gap-1 transition-all duration-300 relative px-4 py-1",
          isActive('/orders') ? "text-vanqis-accent" : "text-vanqis-base-text/40"
        )}>
          {isActive('/orders') && <div className="absolute inset-0 bg-vanqis-accent-soft rounded-xl -z-10" />}
          <Package className="w-5 h-5" strokeWidth={isActive('/orders') ? 2.5 : 1.5} />
          <span className="text-[9px] font-black uppercase tracking-wider">Pesanan</span>
        </Link>

        <Link to={isAuthenticated ? "/profile" : "/login"} className={cn(
          "flex flex-col items-center gap-1 transition-all duration-300 relative px-4 py-1",
          isActive('/login') || isActive('/profile') ? "text-vanqis-accent" : "text-vanqis-base-text/40"
        )}>
          {(isActive('/login') || isActive('/profile')) && <div className="absolute inset-0 bg-vanqis-accent-soft rounded-xl -z-10" />}
          <User className="w-5 h-5" strokeWidth={isActive('/login') || isActive('/profile') ? 2.5 : 1.5} />
          <span className="text-[9px] font-black uppercase tracking-wider">{isAuthenticated ? "Akun" : "Masuk"}</span>
        </Link>
      </nav>
    </>
  );
}
