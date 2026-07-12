import PageLayout from '../components/PageLayout';
import { motion } from 'framer-motion';

const FUEL_DATA = [
  { id: '#FL-501', vehicle: 'VAN-05', driver: 'Arjun M.', amount: '45', cost: '4,500', date: '12 Jul 2026' },
  { id: '#FL-502', vehicle: 'TRUCK-11', driver: 'Vikram S.', amount: '120', cost: '11,200', date: '10 Jul 2026' },
  { id: '#FL-503', vehicle: 'MINI-03', driver: 'Rahul K.', amount: '30', cost: '3,000', date: '09 Jul 2026' },
];

export default function FuelExpenses() {
  return (
    <PageLayout 
      title="Fuel & Expenses" 
      action={<button className="bg-foreground text-background font-bold px-4 py-2.5 text-sm rounded-xl hover:bg-foreground/90 transition-all shadow-md active:scale-95">+ Log Fuel</button>}
    >
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-mutedForeground border-b border-border">
                <th className="pb-3 font-medium px-2">Log ID</th>
                <th className="pb-3 font-medium">Vehicle</th>
                <th className="pb-3 font-medium">Driver</th>
                <th className="pb-3 font-medium">Amount (L)</th>
                <th className="pb-3 font-medium">Cost (₹)</th>
                <th className="pb-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="text-foreground">
              {FUEL_DATA.map((log, i) => (
                <motion.tr 
                  key={log.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  className="border-b border-border/40 hover:bg-muted/30 transition-colors group"
                >
                  <td className="py-4 px-2 font-mono text-xs">{log.id}</td>
                  <td className="py-4 font-medium group-hover:text-primary transition-colors">{log.vehicle}</td>
                  <td className="py-4 text-mutedForeground">{log.driver}</td>
                  <td className="py-4 font-medium text-primary">{log.amount}</td>
                  <td className="py-4 font-bold">{log.cost}</td>
                  <td className="py-4 text-mutedForeground">{log.date}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageLayout>
  );
}
