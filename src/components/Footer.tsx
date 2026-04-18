import { Leaf } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t mt-12">
      <div className="container-app py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <Leaf className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-foreground">VanqisFresh</span>
        </div>
        <p>&copy; {new Date().getFullYear()} VanqisFresh. All rights reserved.</p>
      </div>
    </footer>
  );
}
