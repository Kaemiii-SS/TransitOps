import { Search, Bell, LogOut, Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Topbar() {
  const [isDark, setIsDark] = useState(true);
  
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(document.documentElement.classList.contains('dark'));
  };

  return (
    <header className="flex items-center justify-between px-8 py-4 border-b border-border bg-background/80 backdrop-blur-md z-10 sticky top-0">
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mutedForeground" size={16} />
        <input 
          type="text" 
          placeholder="Search vehicles, drivers, or trips..." 
          className="w-full bg-muted border border-border rounded-lg py-2 pl-10 pr-4 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-mutedForeground"
        />
      </div>
      
      <div className="flex items-center gap-5">
        <button onClick={toggleTheme} className="p-2 text-mutedForeground hover:text-foreground hover:bg-muted rounded-full transition-colors" title="Toggle Theme">
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button className="relative p-2 text-mutedForeground hover:text-foreground hover:bg-muted rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-background"></span>
        </button>
        
        <div className="w-px h-6 bg-border mx-1"></div>
        
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Raven K.</span>
            <span className="text-xs text-mutedForeground">Fleet Manager</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-accent text-primary flex items-center justify-center text-sm font-bold border border-border group-hover:border-primary/50 transition-colors shadow-sm">
            RK
          </div>
        </div>

        <div className="w-px h-6 bg-border mx-1"></div>
        
        <Link to="/login" className="p-2 text-mutedForeground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors" title="Sign Out">
          <LogOut size={18} />
        </Link>
      </div>
    </header>
  );
}
