import { useState } from 'react';
import api from '../../utils/api';

export default function AddDriverForm({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    licenseNumber: '',
    licenseCategory: 'HTV',
    licenseExpiryDate: '',
    contactNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.contactNumber.replace(/\D/g, '').length < 10) {
      setError('Contact number must contain at least 10 digits');
      return;
    }

    if (new Date(formData.licenseExpiryDate) <= new Date()) {
      setError('License expiry date must be in the future');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await api.post('/drivers', formData);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add driver');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg">{error}</div>}
      
      <div>
        <label className="block text-xs font-bold text-mutedForeground uppercase tracking-widest mb-2">Driver Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50" placeholder="John Doe" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-mutedForeground uppercase tracking-widest mb-2">License Number</label>
          <input type="text" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} required className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50" placeholder="DL-123456789" />
        </div>
        <div>
          <label className="block text-xs font-bold text-mutedForeground uppercase tracking-widest mb-2">License Category</label>
          <select name="licenseCategory" value={formData.licenseCategory} onChange={handleChange} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 appearance-none cursor-pointer">
            <option value="HTV">HTV</option>
            <option value="LMV">LMV</option>
            <option value="HMV">HMV</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-mutedForeground uppercase tracking-widest mb-2">Expiry Date</label>
          <input type="date" name="licenseExpiryDate" value={formData.licenseExpiryDate} onChange={handleChange} required className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50" />
        </div>
        <div>
          <label className="block text-xs font-bold text-mutedForeground uppercase tracking-widest mb-2">Contact Number</label>
          <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleChange} required className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50" placeholder="+1 234 567 8900" />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-border/50">
        <button type="button" onClick={onCancel} className="flex-1 bg-muted text-mutedForeground font-bold px-4 py-3 rounded-xl hover:bg-muted/80 transition-all text-sm">Cancel</button>
        <button type="submit" disabled={loading} className="flex-1 bg-primary text-primaryForeground font-bold px-4 py-3 rounded-xl hover:bg-primary/90 transition-all text-sm shadow-md disabled:opacity-70">
          {loading ? 'Saving...' : 'Save Driver'}
        </button>
      </div>
    </form>
  );
}
