import PageLayout from '../components/PageLayout';
import { motion } from 'framer-motion';

const TRIPS_DATA = [
  { id: '#TRP-892', vehicle: 'VAN-05', origin: 'WareHouse B', dest: 'Mumbai Central', status: 'IN_TRANSIT', departure: '08:00 AM' },
  { id: '#TRP-893', vehicle: 'TRUCK-04', origin: 'Pune Hub', dest: 'Navi Mumbai', status: 'IN_TRANSIT', departure: '09:30 AM' },
  { id: '#TRP-894', vehicle: 'MINI-03', origin: 'Thane East', dest: 'Dadar', status: 'SCHEDULED', departure: '14:00 PM' },
];

export default function Trips() {
  return (
    <PageLayout 
      title="Trips & Dispatch" 
      action={<button className="bg-foreground text-background font-bold px-4 py-2.5 text-sm rounded-xl hover:bg-foreground/90 transition-all shadow-md active:scale-95">+ New Trip</button>}
    >
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-mutedForeground border-b border-border">
                <th className="pb-3 font-medium px-2">Trip ID</th>
                <th className="pb-3 font-medium">Vehicle</th>
                <th className="pb-3 font-medium">Origin</th>
                <th className="pb-3 font-medium">Destination</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Departure</th>
              </tr>
            </thead>
            <tbody className="text-foreground">
              {TRIPS_DATA.map((trip, i) => (
                <motion.tr 
                  key={trip.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  className="border-b border-border/40 hover:bg-muted/30 transition-colors group"
                >
                  <td className="py-4 px-2 font-mono text-xs">{trip.id}</td>
                  <td className="py-4 font-medium group-hover:text-primary transition-colors">{trip.vehicle}</td>
                  <td className="py-4 text-mutedForeground">{trip.origin}</td>
                  <td className="py-4 text-mutedForeground">{trip.dest}</td>
                  <td className="py-4">
                    {trip.status === 'IN_TRANSIT' && <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20 tracking-wide uppercase">In Transit</span>}
                    {trip.status === 'SCHEDULED' && <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold bg-muted text-mutedForeground border border-border tracking-wide uppercase">Scheduled</span>}
                  </td>
                  <td className="py-4 text-mutedForeground">{trip.departure}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageLayout>
  );
}
