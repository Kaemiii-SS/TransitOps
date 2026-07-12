import PageLayout from '../components/PageLayout';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../utils/api';
import Modal from '../components/Modal';
import AddTripForm from '../components/forms/AddTripForm';

export default function Trips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const response = await api.get('/trips');
      setTrips(response.data.data);
    } catch (error) {
      console.error('Failed to fetch trips:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleAddSuccess = () => {
    setIsModalOpen(false);
    fetchTrips();
  };

  return (
    <PageLayout 
      title="Dispatch Center" 
      action={<button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-foreground text-background font-bold px-4 py-2.5 text-sm rounded-xl hover:bg-foreground/90 transition-all shadow-md active:scale-95"><Plus size={16} /> New Trip</button>}
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
              {loading ? (
                <tr><td colSpan="6" className="py-4 text-center text-mutedForeground">Loading trips...</td></tr>
              ) : trips.length === 0 ? (
                <tr><td colSpan="6" className="py-4 text-center text-mutedForeground">No trips found</td></tr>
              ) : (
                trips.map((trip, i) => (
                  <motion.tr 
                    key={trip.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    className="border-b border-border/40 hover:bg-muted/30 transition-colors group"
                  >
                    <td className="py-4 px-2 font-mono text-xs">#TRP-{trip.id}</td>
                    <td className="py-4 font-medium group-hover:text-primary transition-colors">{trip.vehicle?.nameModel || 'N/A'}</td>
                    <td className="py-4 text-mutedForeground">{trip.source}</td>
                    <td className="py-4 text-mutedForeground">{trip.destination}</td>
                    <td className="py-4">
                      {trip.status === 'DISPATCHED' && <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20 tracking-wide uppercase">In Transit</span>}
                      {trip.status === 'DRAFT' && <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold bg-muted text-foreground border border-border tracking-wide uppercase">Draft</span>}
                      {trip.status === 'COMPLETED' && <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold bg-muted text-mutedForeground border border-border tracking-wide uppercase">Completed</span>}
                      {trip.status === 'CANCELLED' && <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold bg-destructive/10 text-destructive border border-destructive/20 tracking-wide uppercase">Cancelled</span>}
                    </td>
                    <td className="py-4 text-mutedForeground">{new Date(trip.createdAt).toLocaleDateString()}</td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Trip">
        <AddTripForm onSuccess={handleAddSuccess} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </PageLayout>
  );
}
