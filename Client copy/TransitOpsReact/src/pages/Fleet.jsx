import PageLayout from '../components/PageLayout';
import { motion } from 'framer-motion';

const FLEET_DATA = [
  { id: 'VAN-05', type: 'Cargo Van', status: 'ON_TRIP', driver: 'Arjun M.', location: 'Mumbai Central' },
  { id: 'TRUCK-11', type: 'Heavy Truck', status: 'AVAILABLE', driver: 'Unassigned', location: 'Pune Hub' },
  { id: 'MINI-03', type: 'Mini Truck', status: 'IN_SHOP', driver: 'Unassigned', location: 'Workshop A' },
  { id: 'VAN-09', type: 'Cargo Van', status: 'AVAILABLE', driver: 'Vikram S.', location: 'Thane East' },
  { id: 'TRUCK-04', type: 'Heavy Truck', status: 'ON_TRIP', driver: 'Rahul K.', location: 'Navi Mumbai' },
];

export default function Fleet() {
  return (
    <PageLayout 
      title="Fleet Management" 
      action={<button className="bg-foreground text-background font-bold px-4 py-2.5 text-sm rounded-xl hover:bg-foreground/90 transition-all shadow-md active:scale-95">+ Add Vehicle</button>}
    >
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-mutedForeground border-b border-border">
                <th className="pb-3 font-medium px-2">Vehicle ID</th>
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Assigned Driver</th>
                <th className="pb-3 font-medium">Current Location</th>
              </tr>
            </thead>
            <tbody className="text-foreground">
              {FLEET_DATA.map((vehicle, i) => (
                <motion.tr 
                  key={vehicle.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  className="border-b border-border/40 hover:bg-muted/30 transition-colors group"
                >
                  <td className="py-4 px-2 font-bold group-hover:text-primary transition-colors">{vehicle.id}</td>
                  <td className="py-4 text-mutedForeground">{vehicle.type}</td>
                  <td className="py-4">
                    {vehicle.status === 'ON_TRIP' && <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20 tracking-wide uppercase">On Trip</span>}
                    {vehicle.status === 'AVAILABLE' && <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold bg-muted text-mutedForeground border border-border tracking-wide uppercase">Available</span>}
                    {vehicle.status === 'IN_SHOP' && <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold bg-destructive/10 text-destructive border border-destructive/20 tracking-wide uppercase">In Shop</span>}
                  </td>
                  <td className="py-4 font-medium">{vehicle.driver}</td>
                  <td className="py-4 text-mutedForeground">{vehicle.location}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageLayout>
  );
}
