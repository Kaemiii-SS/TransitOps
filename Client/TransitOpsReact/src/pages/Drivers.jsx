import PageLayout from '../components/PageLayout';
import { motion } from 'framer-motion';

const DRIVER_DATA = [
  { id: '#DRV-001', name: 'Arjun Mehta', license: 'MH-04-2015-1234', category: 'HMV', status: 'ON_DUTY', assignedTo: 'VAN-05' },
  { id: '#DRV-002', name: 'Vikram Singh', license: 'MH-12-2018-5678', category: 'LMV', status: 'OFF_DUTY', assignedTo: 'VAN-09' },
  { id: '#DRV-003', name: 'Rahul Kumar', license: 'MH-43-2012-9012', category: 'HMV', status: 'ON_DUTY', assignedTo: 'TRUCK-04' },
  { id: '#DRV-004', name: 'Sanjay Patil', license: 'MH-02-2019-3456', category: 'LMV', status: 'ON_LEAVE', assignedTo: 'None' },
];

export default function Drivers() {
  return (
    <PageLayout 
      title="Driver Management" 
      action={<button className="bg-foreground text-background font-bold px-4 py-2.5 text-sm rounded-xl hover:bg-foreground/90 transition-all shadow-md active:scale-95">+ Add Driver</button>}
    >
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-mutedForeground border-b border-border">
                <th className="pb-3 font-medium px-2">Driver ID</th>
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">License No.</th>
                <th className="pb-3 font-medium">Category</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Assigned Vehicle</th>
              </tr>
            </thead>
            <tbody className="text-foreground">
              {DRIVER_DATA.map((driver, i) => (
                <motion.tr 
                  key={driver.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  className="border-b border-border/40 hover:bg-muted/30 transition-colors group"
                >
                  <td className="py-4 px-2 font-mono text-xs">{driver.id}</td>
                  <td className="py-4 font-medium group-hover:text-primary transition-colors">{driver.name}</td>
                  <td className="py-4 text-mutedForeground font-mono text-xs">{driver.license}</td>
                  <td className="py-4">{driver.category}</td>
                  <td className="py-4">
                    {driver.status === 'ON_DUTY' && <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20 tracking-wide uppercase">On Duty</span>}
                    {driver.status === 'OFF_DUTY' && <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold bg-muted text-mutedForeground border border-border tracking-wide uppercase">Off Duty</span>}
                    {driver.status === 'ON_LEAVE' && <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold bg-destructive/10 text-destructive border border-destructive/20 tracking-wide uppercase">On Leave</span>}
                  </td>
                  <td className="py-4 font-medium">{driver.assignedTo}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageLayout>
  );
}
