import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-vanqis-base-layout p-4">
      <div className="w-full max-w-2xl bg-vanqis-base-white border-2 border-vanqis-base-text p-12 md:p-20 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 border-r-2 border-b-2 border-vanqis-base-soft/50 -translate-x-16 -translate-y-16" />
        <div className="absolute bottom-0 right-0 w-32 h-32 border-l-2 border-t-2 border-vanqis-base-soft/50 translate-x-16 translate-y-16" />
        
        <h1 className="text-8xl md:text-9xl font-black text-vanqis-base-text tracking-tighter mb-2 leading-none">
          404
        </h1>
        <div className="w-16 h-1 bg-vanqis-fresh-carrot mx-auto mb-8" />
        
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-vanqis-base-text mb-4">
          Halaman Tidak Ditemukan
        </h2>
        <p className="text-sm font-medium text-vanqis-base-text/60 mb-10 max-w-md mx-auto leading-relaxed">
          Maaf, halaman yang Anda tuju mungkin telah dipindahkan, dihapus, atau tidak pernah ada. Mari kembali ke jalan yang benar.
        </p>
        
        <Link 
          to="/" 
          className="inline-flex items-center justify-center h-14 px-8 bg-vanqis-base-text text-vanqis-base-white font-bold uppercase tracking-widest text-xs hover:bg-vanqis-fresh-carrot transition-colors outline-none group"
        >
          <ArrowLeft className="w-4 h-4 mr-3 group-hover:-translate-x-1 transition-transform" strokeWidth={2} />
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
