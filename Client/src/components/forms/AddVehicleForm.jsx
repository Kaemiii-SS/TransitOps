import { useState } from 'react';
import api from '../../utils/api';

export default function AddVehicleForm({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    registrationNumber: '',
    nameModel: '',
    type: 'TRUCK',
    maxLoadCapacity: '',
    odometer: '',
    acquisitionCost: '',
    region: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (Number(formData.maxLoadCapacity) <= 0 || Number(formData.acquisitionCost) < 0 || Number(formData.odometer) < 0) {
      setError('Load capacity, cost, and odometer must be valid positive numbers');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await api.post('/vehicles', formData);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add vehicle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg">{error}</div>}
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-mutedForeground uppercase tracking-widest mb-2">Reg Number</label>
          <input type="text" name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} required className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50" placeholder="XYZ-1234" />
        </div>
        <div>
          <label className="block text-xs font-bold text-mutedForeground uppercase tracking-widest mb-2">Model Name</label>
          <input type="text" name="nameModel" value={formData.nameModel} onChange={handleChange} required className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50" placeholder="Volvo FH16" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-mutedForeground uppercase tracking-widest mb-2">Type</label>
          <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 appearance-none cursor-pointer">
            <option value="TRUCK">Truck</option>
            <option value="VAN">Van</option>
            <option value="TRAILER">Trailer</option>
            <option value="MINIVAN">Minivan</option>
            <option value="PICKUP">Pickup</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-mutedForeground uppercase tracking-widest mb-2">Region (Optional)</label>
          <input type="text" name="region" value={formData.region} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50" placeholder="North Zone" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-mutedForeground uppercase tracking-widest mb-2">Max Load (kg)</label>
          <input type="number" name="maxLoadCapacity" value={formData.maxLoadCapacity} onChange={handleChange} required min="1" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50" placeholder="5000" />
        </div>
        <div>
          <label className="block text-xs font-bold text-mutedForeground uppercase tracking-widest mb-2">Odometer</label>
          <input type="number" name="odometer" value={formData.odometer} onChange={handleChange} required min="0" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50" placeholder="1000" />
        </div>
        <div>
          <label className="block text-xs font-bold text-mutedForeground uppercase tracking-widest mb-2">Cost (₹)</label>
          <input type="number" name="acquisitionCost" value={formData.acquisitionCost} onChange={handleChange} required min="0" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50" placeholder="1500000" />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-border/50">
        <button type="button" onClick={onCancel} className="flex-1 bg-muted text-mutedForeground font-bold px-4 py-3 rounded-xl hover:bg-muted/80 transition-all text-sm">Cancel</button>
        <button type="submit" disabled={loading} className="flex-1 bg-primary text-primaryForeground font-bold px-4 py-3 rounded-xl hover:bg-primary/90 transition-all text-sm shadow-md disabled:opacity-70">
          {loading ? 'Saving...' : 'Save Vehicle'}
        </button>
      </div>
    </form>
  );
}
