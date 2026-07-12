import PageLayout from '../components/PageLayout';
import { Truck, MapPin, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const KPI_DATA = [
  { label: 'Active Vehicles', value: '42', icon: Truck, color: 'text-primary' },
  { label: 'Vehicles on Trip', value: '34', icon: MapPin, color: 'text-foreground' },
  { label: 'In Shop (Maint)', value: '5', icon: AlertCircle, color: 'text-destructive' },
  { label: 'Available', value: '3', icon: CheckCircle2, color: 'text-mutedForeground' },
];

export default function Dashboard() {
  return (
    <PageLayout title="Overview">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
        {KPI_DATA.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="bg-card border border-border rounded-2xl p-5 hover:border-border/80 transition-colors shadow-sm flex flex-col justify-between h-36"
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-mutedForeground uppercase tracking-wider">{kpi.label}</span>
                <Icon size={18} className={kpi.color} />
              </div>
              <div className="text-4xl font-bold tracking-tighter text-foreground">{kpi.value}</div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">Recent Trips</h2>
            <button className="text-sm font-medium text-primary hover:underline">View all</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-mutedForeground border-b border-border">
                  <th className="pb-3 font-medium px-2">Trip ID</th>
                  <th className="pb-3 font-medium">Vehicle</th>
                  <th className="pb-3 font-medium">Destination</th>
                  <th className="pb-3 font-medium text-right pr-2">Status</th>
                </tr>
              </thead>
              <tbody className="text-foreground">
                <tr className="border-b border-border/40 hover:bg-muted/30 transition-colors group">
                  <td className="py-4 px-2 font-mono text-xs">#TRP-892</td>
                  <td className="py-4 font-medium group-hover:text-primary transition-colors">VAN-05</td>
                  <td className="py-4 text-mutedForeground">Mumbai Central</td>
                  <td className="py-4 text-right pr-2"><span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20 tracking-wide uppercase">En Route</span></td>
                </tr>
                <tr className="border-b border-border/40 hover:bg-muted/30 transition-colors group">
                  <td className="py-4 px-2 font-mono text-xs">#TRP-891</td>
                  <td className="py-4 font-medium group-hover:text-primary transition-colors">TRUCK-11</td>
                  <td className="py-4 text-mutedForeground">Pune Hub</td>
                  <td className="py-4 text-right pr-2"><span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-muted text-mutedForeground border border-border tracking-wide uppercase">Completed</span></td>
                </tr>
                <tr className="hover:bg-muted/30 transition-colors group">
                  <td className="py-4 px-2 font-mono text-xs">#TRP-890</td>
                  <td className="py-4 font-medium group-hover:text-primary transition-colors">MINI-03</td>
                  <td className="py-4 text-mutedForeground">Thane East</td>
                  <td className="py-4 text-right pr-2"><span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20 tracking-wide uppercase">En Route</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col">
          <h2 className="text-lg font-semibold tracking-tight text-foreground mb-6">Vehicle Status</h2>
          <div className="flex-1 flex flex-col justify-center gap-8">
            <div>
              <div className="flex justify-between text-sm mb-3">
                <span className="text-mutedForeground font-medium">On Trip</span>
                <span className="font-bold text-foreground">81%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '81%' }} transition={{ duration: 1, ease: 'easeOut' }} className="h-full bg-primary rounded-full"></motion.div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-3">
                <span className="text-mutedForeground font-medium">In Shop</span>
                <span className="font-bold text-foreground">12%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '12%' }} transition={{ duration: 1, ease: 'easeOut', delay: 0.1 }} className="h-full bg-destructive/80 rounded-full"></motion.div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-3">
                <span className="text-mutedForeground font-medium">Available</span>
                <span className="font-bold text-foreground">7%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '7%' }} transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }} className="h-full bg-mutedForeground/40 rounded-full"></motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
