import { useState, useEffect } from 'react';
import api from '../../utils/api';

export default function LogFuelForm({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    vehicleId: '',
    tripId: '',
    liters: '',
    cost: '',
    date: new Date().toISOString().split('T')[0]
  });
  
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await api.get('/vehicles');
        const v = res.data.data;
        setVehicles(v);
        if (v.length > 0) setFormData(prev => ({ ...prev, vehicleId: v[0].id }));
      } catch (err) {
        setError('Failed to load vehicles');
      } finally {
        setFetching(false);
      }
    };
    fetchVehicles();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.vehicleId) {
      setError('A vehicle is required');
      return;
    }
    
    if (Number(formData.liters) <= 0 || Number(formData.cost) < 0) {
      setError('Liters and cost must be positive numbers');
      return;
    }

    if (new Date(formData.date) > new Date()) {
      setError('Fuel log date cannot be in the future');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const payload = { ...formData };
      if (!payload.tripId) delete payload.tripId; // tripId is optional
      await api.post('/fuel-logs', payload);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to log fuel');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="p-4 text-center text-mutedForeground text-sm">Loading vehicles...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg">{error}</div>}
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-mutedForeground uppercase tracking-widest mb-2">Select Vehicle</label>
          <select name="vehicleId" value={formData.vehicleId} onChange={handleChange} required className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 appearance-none cursor-pointer">
            {vehicles.length === 0 && <option value="">No vehicles found</option>}
            {vehicles.map(v => (
              <option key={v.id} value={v.id}>{v.registrationNumber} ({v.type})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-mutedForeground uppercase tracking-widest mb-2">Trip ID (Optional)</label>
          <input type="number" name="tripId" value={formData.tripId} onChange={handleChange} min="1" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50" placeholder="e.g. 42" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-mutedForeground uppercase tracking-widest mb-2">Liters</label>
          <input type="number" name="liters" value={formData.liters} onChange={handleChange} required min="1" step="0.1" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50" placeholder="50.5" />
        </div>
        <div>
          <label className="block text-xs font-bold text-mutedForeground uppercase tracking-widest mb-2">Total Cost (₹)</label>
          <input type="number" name="cost" value={formData.cost} onChange={handleChange} required min="0" step="0.1" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50" placeholder="4800" />
        </div>
        <div>
          <label className="block text-xs font-bold text-mutedForeground uppercase tracking-widest mb-2">Date</label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} required className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50" />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-border/50">
        <button type="button" onClick={onCancel} className="flex-1 bg-muted text-mutedForeground font-bold px-4 py-3 rounded-xl hover:bg-muted/80 transition-all text-sm">Cancel</button>
        <button type="submit" disabled={loading || vehicles.length === 0} className="flex-1 bg-primary text-primaryForeground font-bold px-4 py-3 rounded-xl hover:bg-primary/90 transition-all text-sm shadow-md disabled:opacity-70">
          {loading ? 'Logging...' : 'Log Fuel'}
        </button>
      </div>
    </form>
  );
}
