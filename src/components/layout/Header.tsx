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
      setScrolled(window.scrollY > 20);
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
        "sticky top-0 z-50 w-full bg-vanqis-base-white transition-all duration-300",
        scrolled ? "border-b border-vanqis-base-soft" : ""
      )}>
        <div className="container-app h-16 md:h-20 flex items-center justify-between gap-4 md:gap-8">
          
          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0 group">
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-black tracking-tight text-vanqis-base-text uppercase leading-none">
                Vanqis<span className="text-vanqis-fresh-carrot">Fresh</span>
              </span>
            </div>
          </Link>

          {/* Pencarian */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-vanqis-base-text/40" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari produk segar..."
              className="w-full h-11 pl-10 pr-4 bg-transparent border border-vanqis-base-soft text-vanqis-base-text placeholder:text-vanqis-base-text/40 rounded-none focus:outline-none focus:border-vanqis-base-text transition-colors text-sm"
            />
            <button type="submit" className="absolute right-0 top-0 bottom-0 px-6 bg-vanqis-base-text text-vanqis-base-white text-xs font-bold uppercase tracking-wider hover:bg-vanqis-fresh-carrot transition-colors">
              Cari
            </button>
          </form>

          {/* Menu Akun */}
          <div className="hidden md:flex items-center gap-6 shrink-0">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 group outline-none">
                  <div className="relative">
                    <User className="w-5 h-5 text-vanqis-base-text group-hover:text-vanqis-fresh-carrot transition-colors" strokeWidth={1.5} />
                  </div>
                  <div className="hidden lg:flex flex-col text-left">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-vanqis-base-text/50 mb-0.5">
                      Akun Saya
                    </span>
                    <span className="text-xs font-black uppercase tracking-widest text-vanqis-base-text group-hover:text-vanqis-fresh-carrot transition-colors">
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
              <Link to="/login" className="text-xs font-bold uppercase tracking-widest text-vanqis-base-text hover:text-vanqis-fresh-carrot transition-colors">
                Masuk
              </Link>
            )}

            <Link to="/cart" className="flex items-center gap-2 group">
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-vanqis-base-text group-hover:text-vanqis-fresh-carrot transition-colors" strokeWidth={1.5} />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-vanqis-fresh-carrot text-vanqis-base-white text-[9px] font-bold flex items-center justify-center rounded-full border border-vanqis-base-white">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-vanqis-base-text hidden lg:block group-hover:text-vanqis-fresh-carrot transition-colors">
                Keranjang
              </span>
            </Link>
          </div>

          {/* Keranjang */}
          <div className="flex md:hidden items-center gap-4">
            <Link to="/cart" className="relative p-2">
              <ShoppingCart className="w-5 h-5 text-vanqis-base-text" strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-vanqis-fresh-carrot text-vanqis-base-white text-[9px] font-bold flex items-center justify-center rounded-full">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>
          </div>

        </div>

        {/* Pencarian Mobile */}
        <div className="md:hidden border-t border-vanqis-base-soft bg-vanqis-base-white">
          <form onSubmit={handleSearch} className="flex relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-vanqis-base-text/40" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari produk segar..."
              className="w-full h-12 pl-12 pr-4 bg-transparent border-none text-vanqis-base-text placeholder:text-vanqis-base-text/40 focus:outline-none text-sm"
            />
          </form>
        </div>
      </header>

      {/* Navigasi */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-vanqis-base-white border-t border-vanqis-base-soft flex items-center justify-between px-6 py-3 pb-safe">
        <Link to="/" className={cn(
          "flex flex-col items-center gap-1 transition-colors",
          isActive('/') ? "text-vanqis-base-text" : "text-vanqis-base-text/40 hover:text-vanqis-base-text"
        )}>
          <Home className="w-5 h-5" strokeWidth={isActive('/') ? 2 : 1.5} />
          <span className="text-[9px] font-bold uppercase tracking-wider">Beranda</span>
        </Link>
        
        <Link to="/orders" className={cn(
          "flex flex-col items-center gap-1 transition-colors",
          isActive('/orders') ? "text-vanqis-base-text" : "text-vanqis-base-text/40 hover:text-vanqis-base-text"
        )}>
          <Package className="w-5 h-5" strokeWidth={isActive('/orders') ? 2 : 1.5} />
          <span className="text-[9px] font-bold uppercase tracking-wider">Pesanan</span>
        </Link>

        <Link to={isAuthenticated ? "/profile" : "/login"} className={cn(
          "flex flex-col items-center gap-1 transition-colors",
          isActive('/login') || isActive('/profile') ? "text-vanqis-base-text" : "text-vanqis-base-text/40 hover:text-vanqis-base-text"
        )}>
          <User className="w-5 h-5" strokeWidth={isActive('/login') || isActive('/profile') ? 2 : 1.5} />
          <span className="text-[9px] font-bold uppercase tracking-wider">{isAuthenticated ? "Akun" : "Masuk"}</span>
        </Link>
      </nav>
    </>
  );
}
