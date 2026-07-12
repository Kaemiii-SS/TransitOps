import { useState, useEffect } from 'react';
import api from '../../utils/api';

export default function LogMaintenanceForm({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    vehicleId: '',
    description: '',
    cost: ''
  });
  
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await api.get('/vehicles/available');
        const v = res.data.data;
        setVehicles(v);
        if (v.length > 0) setFormData(prev => ({ ...prev, vehicleId: v[0].id }));
      } catch (err) {
        setError('Failed to load available vehicles');
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
    
    if (formData.description.trim().length < 5) {
      setError('Please provide a clearer description (at least 5 characters)');
      return;
    }

    if (Number(formData.cost) < 0) {
      setError('Cost cannot be negative');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await api.post('/maintenance', formData);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to log maintenance');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="p-4 text-center text-mutedForeground text-sm">Loading available vehicles...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg">{error}</div>}
      
      <div>
        <label className="block text-xs font-bold text-mutedForeground uppercase tracking-widest mb-2">Select Vehicle</label>
        <select name="vehicleId" value={formData.vehicleId} onChange={handleChange} required className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 appearance-none cursor-pointer">
          {vehicles.length === 0 && <option value="">No available vehicles</option>}
          {vehicles.map(v => (
            <option key={v.id} value={v.id}>{v.registrationNumber} ({v.type})</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold text-mutedForeground uppercase tracking-widest mb-2">Issue Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} required rows={3} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50" placeholder="Describe the maintenance issue..." />
      </div>

      <div>
        <label className="block text-xs font-bold text-mutedForeground uppercase tracking-widest mb-2">Estimated Cost (₹)</label>
        <input type="number" name="cost" value={formData.cost} onChange={handleChange} required min="0" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50" placeholder="5000" />
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-border/50">
        <button type="button" onClick={onCancel} className="flex-1 bg-muted text-mutedForeground font-bold px-4 py-3 rounded-xl hover:bg-muted/80 transition-all text-sm">Cancel</button>
        <button type="submit" disabled={loading || vehicles.length === 0} className="flex-1 bg-primary text-primaryForeground font-bold px-4 py-3 rounded-xl hover:bg-primary/90 transition-all text-sm shadow-md disabled:opacity-70">
          {loading ? 'Logging...' : 'Log Maintenance'}
        </button>
      </div>
    </form>
  );
}
