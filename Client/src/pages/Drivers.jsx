import PageLayout from '../components/PageLayout';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../utils/api';
import Modal from '../components/Modal';
import AddDriverForm from '../components/forms/AddDriverForm';

export default function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchDrivers = async () => {
    try {
      const response = await api.get('/drivers');
      setDrivers(response.data.data);
    } catch (error) {
      console.error('Failed to fetch drivers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleAddSuccess = () => {
    setIsModalOpen(false);
    fetchDrivers();
  };

  return (
    <PageLayout 
      title="Driver Roster" 
      action={<button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-foreground text-background font-bold px-4 py-2.5 text-sm rounded-xl hover:bg-foreground/90 transition-all shadow-md active:scale-95"><Plus size={16} /> Add Driver</button>}
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
              {loading ? (
                <tr><td colSpan="6" className="py-4 text-center text-mutedForeground">Loading drivers...</td></tr>
              ) : drivers.length === 0 ? (
                <tr><td colSpan="6" className="py-4 text-center text-mutedForeground">No drivers found</td></tr>
              ) : (
                drivers.map((driver, i) => (
                  <motion.tr 
                    key={driver.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    className="border-b border-border/40 hover:bg-muted/30 transition-colors group"
                  >
                    <td className="py-4 px-2 font-mono text-xs">#DRV-{driver.id}</td>
                    <td className="py-4 font-medium group-hover:text-primary transition-colors">{driver.name}</td>
                    <td className="py-4 text-mutedForeground font-mono text-xs">{driver.licenseNumber}</td>
                    <td className="py-4">{driver.licenseCategory}</td>
                    <td className="py-4">
                      {driver.status === 'ON_TRIP' && <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20 tracking-wide uppercase">On Trip</span>}
                      {driver.status === 'AVAILABLE' && <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold bg-muted text-foreground border border-border tracking-wide uppercase">Available</span>}
                      {driver.status === 'OFF_DUTY' && <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold bg-muted text-mutedForeground border border-border tracking-wide uppercase">Off Duty</span>}
                      {driver.status === 'SUSPENDED' && <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold bg-destructive/10 text-destructive border border-destructive/20 tracking-wide uppercase">Suspended</span>}
                    </td>
                    <td className="py-4 font-medium text-mutedForeground/60">N/A</td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register New Driver">
        <AddDriverForm onSuccess={handleAddSuccess} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </PageLayout>
  );
}
