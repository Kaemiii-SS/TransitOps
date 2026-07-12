import PageLayout from '../components/PageLayout';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import api from '../utils/api';

export default function Fleet() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await api.get('/vehicles');
        setVehicles(response.data.data);
      } catch (error) {
        console.error('Failed to fetch vehicles:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);
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
              {loading ? (
                <tr><td colSpan="5" className="py-4 text-center text-mutedForeground">Loading vehicles...</td></tr>
              ) : vehicles.length === 0 ? (
                <tr><td colSpan="5" className="py-4 text-center text-mutedForeground">No vehicles found</td></tr>
              ) : (
                vehicles.map((vehicle, i) => (
                  <motion.tr 
                    key={vehicle.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    className="border-b border-border/40 hover:bg-muted/30 transition-colors group"
                  >
                    <td className="py-4 px-2 font-bold group-hover:text-primary transition-colors">{vehicle.registrationNumber}</td>
                    <td className="py-4 text-mutedForeground">{vehicle.type} ({vehicle.nameModel})</td>
                    <td className="py-4">
                      {vehicle.status === 'ON_TRIP' && <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20 tracking-wide uppercase">On Trip</span>}
                      {vehicle.status === 'AVAILABLE' && <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold bg-muted text-mutedForeground border border-border tracking-wide uppercase">Available</span>}
                      {vehicle.status === 'IN_SHOP' && <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold bg-destructive/10 text-destructive border border-destructive/20 tracking-wide uppercase">In Shop</span>}
                      {vehicle.status === 'RETIRED' && <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold bg-muted text-mutedForeground border border-border tracking-wide uppercase">Retired</span>}
                    </td>
                    <td className="py-4 font-medium text-mutedForeground/60">N/A</td>
                    <td className="py-4 text-mutedForeground">{vehicle.region || 'Unassigned'}</td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </PageLayout>
  );
}
