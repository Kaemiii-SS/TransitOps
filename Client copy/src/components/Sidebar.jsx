import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Truck, Users, Map, Wrench, Droplet, BarChart3, Settings } from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Fleet', path: '/fleet', icon: Truck },
  { name: 'Drivers', path: '/drivers', icon: Users },
  { name: 'Trips', path: '/trips', icon: Map },
  { name: 'Maintenance', path: '/maintenance', icon: Wrench },
  { name: 'Fuel & Expenses', path: '/fuel', icon: Droplet },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-[240px] shrink-0 bg-card border-r border-border flex flex-col p-4 z-20">
      <div className="flex items-center gap-2 px-3 mb-10 mt-2">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-background font-bold tracking-tighter">TO</div>
        <span className="text-xl font-bold tracking-tight text-foreground">TransitOps</span>
      </div>
      
      <nav className="flex-1 flex flex-col gap-1.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive 
                  ? 'bg-accent text-foreground shadow-sm' 
                  : 'text-mutedForeground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Icon size={18} className={isActive ? "text-primary" : "opacity-70"} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-3 py-4 text-xs text-mutedForeground/60 font-medium">
        TransitOps v2.0 <br/> React + Tailwind Edition
      </div>
    </aside>
  );
}
