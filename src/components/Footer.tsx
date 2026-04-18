export default function Footer() {
  return (
    <footer className="border-t mt-12">
      <div className="container-app py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2 mb-4">
          <img src="/vanqisfresh.svg" alt="VanqisFresh Logo" className="w-8 h-8" />
          <span className="font-bold text-lg tracking-tight">VanqisFresh</span>
        </div>
        <p>&copy; {new Date().getFullYear()} VanqisFresh. All rights reserved.</p>
      </div>
    </footer>
  );
}
