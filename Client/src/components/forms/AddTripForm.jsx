import { useState, useEffect } from 'react';
import api from '../../utils/api';

export default function AddTripForm({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    source: '',
    destination: '',
    vehicleId: '',
    driverId: '',
    cargoWeight: '',
    plannedDistance: ''
  });
  
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDependencies = async () => {
      try {
        const [vehRes, drvRes] = await Promise.all([
          api.get('/vehicles/available'),
          api.get('/drivers/available')
        ]);
        const v = vehRes.data.data;
        const d = drvRes.data.data;
        setVehicles(v);
        setDrivers(d);
        if (v.length > 0) setFormData(prev => ({ ...prev, vehicleId: v[0].id }));
        if (d.length > 0) setFormData(prev => ({ ...prev, driverId: d[0].id }));
      } catch (err) {
        setError('Failed to load available vehicles or drivers');
      } finally {
        setFetching(false);
      }
    };
    fetchDependencies();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.vehicleId || !formData.driverId) {
      setError('A vehicle and a driver are required');
      return;
    }
    
    if (Number(formData.cargoWeight) <= 0 || Number(formData.plannedDistance) <= 0) {
      setError('Cargo weight and planned distance must be greater than zero');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await api.post('/trips', formData);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create trip');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="p-4 text-center text-mutedForeground text-sm">Loading available resources...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg">{error}</div>}
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-mutedForeground uppercase tracking-widest mb-2">Source</label>
          <input type="text" name="source" value={formData.source} onChange={handleChange} required className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50" placeholder="Warehouse A" />
        </div>
        <div>
          <label className="block text-xs font-bold text-mutedForeground uppercase tracking-widest mb-2">Destination</label>
          <input type="text" name="destination" value={formData.destination} onChange={handleChange} required className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50" placeholder="Client B" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-mutedForeground uppercase tracking-widest mb-2">Assign Vehicle</label>
          <select name="vehicleId" value={formData.vehicleId} onChange={handleChange} required className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 appearance-none cursor-pointer">
            {vehicles.length === 0 && <option value="">No available vehicles</option>}
            {vehicles.map(v => (
              <option key={v.id} value={v.id}>{v.registrationNumber} ({v.type}) - Max: {v.maxLoadCapacity}kg</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-mutedForeground uppercase tracking-widest mb-2">Assign Driver</label>
          <select name="driverId" value={formData.driverId} onChange={handleChange} required className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 appearance-none cursor-pointer">
            {drivers.length === 0 && <option value="">No available drivers</option>}
            {drivers.map(d => (
              <option key={d.id} value={d.id}>{d.name} ({d.licenseCategory})</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-mutedForeground uppercase tracking-widest mb-2">Cargo Wt (kg)</label>
          <input type="number" name="cargoWeight" value={formData.cargoWeight} onChange={handleChange} required min="1" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50" placeholder="2000" />
        </div>
        <div>
          <label className="block text-xs font-bold text-mutedForeground uppercase tracking-widest mb-2">Planned Dist (km)</label>
          <input type="number" name="plannedDistance" value={formData.plannedDistance} onChange={handleChange} required min="1" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50" placeholder="150" />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-border/50">
        <button type="button" onClick={onCancel} className="flex-1 bg-muted text-mutedForeground font-bold px-4 py-3 rounded-xl hover:bg-muted/80 transition-all text-sm">Cancel</button>
        <button type="submit" disabled={loading || vehicles.length === 0 || drivers.length === 0} className="flex-1 bg-primary text-primaryForeground font-bold px-4 py-3 rounded-xl hover:bg-primary/90 transition-all text-sm shadow-md disabled:opacity-70">
          {loading ? 'Creating...' : 'Create Draft Trip'}
        </button>
      </div>
    </form>
  );
}
