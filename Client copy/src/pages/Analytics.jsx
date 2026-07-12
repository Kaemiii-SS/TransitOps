import PageLayout from '../components/PageLayout';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../utils/api';

export default function Analytics() {
  const [utilization, setUtilization] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/analytics/fleet-utilization');
        setUtilization(res.data.data.utilizationPercent);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      }
    };
    fetchAnalytics();
  }, []);

  const handleExport = async () => {
    try {
      const res = await api.get('/analytics/export/csv', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'fleet-report.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Failed to export CSV:', error);
    }
  };

  return (
    <PageLayout 
      title="Reports & Analytics" 
      action={<button onClick={handleExport} className="flex items-center gap-2 bg-foreground text-background font-bold px-4 py-2.5 text-sm rounded-xl hover:bg-foreground/90 transition-all shadow-md active:scale-95"><Download size={16} /> Export CSV</button>}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="text-xs font-bold text-mutedForeground uppercase tracking-wider mb-4">Fleet Utilization</div>
          <div className="text-4xl font-black text-foreground mb-2">
            {utilization !== null ? utilization : '--'}<span className="text-2xl text-mutedForeground">%</span>
          </div>
          <div className="text-xs text-mutedForeground bg-muted/50 p-2 rounded-lg italic">Vehicles ON_TRIP / Total Active Vehicles</div>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="text-xs font-bold text-mutedForeground uppercase tracking-wider mb-4">Avg Fuel Efficiency</div>
          <div className="text-4xl font-black text-foreground mb-2">6.8<span className="text-2xl text-mutedForeground"> km/L</span></div>
          <div className="text-xs text-mutedForeground bg-muted/50 p-2 rounded-lg italic">∑(Actual Distance) / ∑(Fuel Consumed)</div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="text-xs font-bold text-mutedForeground uppercase tracking-wider mb-4">Total Op Cost</div>
          <div className="text-4xl font-black text-destructive mb-2"><span className="text-2xl">₹</span>1.42<span className="text-2xl text-mutedForeground">L</span></div>
          <div className="text-xs text-mutedForeground bg-muted/50 p-2 rounded-lg italic">SUM(Fuel Cost) + SUM(Maint Cost)</div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold tracking-tight text-foreground mb-1">Vehicle ROI Distribution</h2>
        <p className="text-xs text-mutedForeground mb-8 italic">Formula: (SUM(Revenue) − (Maintenance + Fuel)) / Acquisition Cost</p>
        
        <div className="flex items-end gap-3 h-48 pb-4 border-b border-border/50 mb-4">
          {[
            { val: 12, label: 'VAN-05', h: '60%', color: 'bg-primary' },
            { val: 18, label: 'TRUCK-11', h: '80%', color: 'bg-foreground' },
            { val: 8.5, label: 'MINI-03', h: '45%', color: 'bg-primary' },
            { val: 4.2, label: 'VAN-09', h: '25%', color: 'bg-mutedForeground' },
            { val: -1.5, label: 'TRUCK-04', h: '10%', color: 'bg-destructive' },
            { val: 9.8, label: 'PICK-02', h: '55%', color: 'bg-primary' },
            { val: 14, label: 'TRAIL-01', h: '70%', color: 'bg-foreground' },
            { val: 6.1, label: 'MINI-08', h: '35%', color: 'bg-mutedForeground' },
          ].map((bar, i) => (
            <div key={i} className="flex-1 flex flex-col items-center group relative h-full justify-end">
              <span className="absolute -top-6 text-[11px] font-bold text-mutedForeground opacity-0 group-hover:opacity-100 transition-opacity">{bar.val}%</span>
              <motion.div 
                initial={{ height: 0 }}
                animate={{ height: bar.h }}
                transition={{ duration: 1, delay: 0.5 + (i * 0.1), ease: "easeOut" }}
                className={`w-full ${bar.color} rounded-t-sm opacity-80 group-hover:opacity-100 transition-opacity cursor-pointer`}
              />
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          {['VAN-05', 'TRUCK-11', 'MINI-03', 'VAN-09', 'TRUCK-04', 'PICK-02', 'TRAIL-01', 'MINI-08'].map((label, i) => (
            <div key={i} className="flex-1 text-center text-[10px] font-mono text-mutedForeground truncate">{label}</div>
          ))}
        </div>
      </motion.div>
    </PageLayout>
  );
}
