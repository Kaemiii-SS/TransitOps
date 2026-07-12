import PageLayout from '../components/PageLayout';
import { motion } from 'framer-motion';

const MAINT_DATA = [
  { id: '#ML-104', vehicle: 'MINI-03', desc: 'Engine Overhaul & Oil Change', cost: '12,500', date: '12 Jul 2026', status: 'ACTIVE' },
  { id: '#ML-103', vehicle: 'TRUCK-04', desc: 'Brake Pad Replacement', cost: '8,200', date: '11 Jul 2026', status: 'CLOSED' },
  { id: '#ML-102', vehicle: 'VAN-09', desc: 'Routine Service (10k km)', cost: '4,500', date: '08 Jul 2026', status: 'CLOSED' },
];

export default function Maintenance() {
  return (
    <PageLayout 
      title="Maintenance Logs" 
      action={<button className="bg-foreground text-background font-bold px-4 py-2.5 text-sm rounded-xl hover:bg-foreground/90 transition-all shadow-md active:scale-95">+ Log Maintenance</button>}
    >
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-mutedForeground border-b border-border">
                <th className="pb-3 font-medium px-2">Log ID</th>
                <th className="pb-3 font-medium">Vehicle</th>
                <th className="pb-3 font-medium">Description</th>
                <th className="pb-3 font-medium">Cost (₹)</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="text-foreground">
              {MAINT_DATA.map((log, i) => (
                <motion.tr 
                  key={log.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  className="border-b border-border/40 hover:bg-muted/30 transition-colors group"
                >
                  <td className="py-4 px-2 font-mono text-xs">{log.id}</td>
                  <td className="py-4 font-medium group-hover:text-primary transition-colors">{log.vehicle}</td>
                  <td className="py-4 text-mutedForeground">{log.desc}</td>
                  <td className="py-4">{log.cost}</td>
                  <td className="py-4 text-mutedForeground">{log.date}</td>
                  <td className="py-4">
                    {log.status === 'ACTIVE' && <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold bg-destructive/10 text-destructive border border-destructive/20 tracking-wide uppercase">Active</span>}
                    {log.status === 'CLOSED' && <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold bg-muted text-mutedForeground border border-border tracking-wide uppercase">Closed</span>}
                  </td>
                  <td className="py-4">
                    {log.status === 'ACTIVE' ? (
                      <button className="text-[11px] font-bold uppercase tracking-wider text-background bg-primary hover:bg-primary/90 px-3 py-1.5 rounded-md transition-colors active:scale-95">Close Job</button>
                    ) : (
                      <span className="text-mutedForeground">--</span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageLayout>
  );
}
