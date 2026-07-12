import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import api from '../utils/api';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.data));
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <div className="hidden md:flex md:w-1/2 bg-card border-r border-border items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary via-background to-background"></div>
        <div className="relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-16 h-16 bg-primary rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg"
          >
            <span className="text-3xl font-black text-background tracking-tighter">TO</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-bold tracking-tighter text-foreground mb-4"
          >
            TransitOps
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-mutedForeground text-lg font-medium"
          >
            Smart Transport Operations Platform.
          </motion.p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8 bg-background relative">
        <div className="absolute top-8 left-8 md:hidden text-2xl font-bold tracking-tighter">TO</div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md space-y-8 bg-card/50 backdrop-blur border border-border p-8 rounded-3xl shadow-2xl"
        >
          <div>
            <h2 className="text-2xl font-semibold text-foreground tracking-tight">Welcome back</h2>
            <p className="text-mutedForeground text-sm mt-2">Sign in to your account to continue</p>
            {error && <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg">{error}</div>}
          </div>
          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-mutedForeground uppercase tracking-widest mb-2">Email Address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-background border border-border rounded-xl px-4 py-3.5 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-mutedForeground/50" placeholder="you@company.com" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <label className="block text-xs font-bold text-mutedForeground uppercase tracking-widest">Password</label>
                  <a href="#" className="text-xs text-primary hover:underline font-medium">Forgot password?</a>
                </div>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-background border border-border rounded-xl px-4 py-3.5 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-mutedForeground/50" placeholder="••••••••" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-foreground text-background font-bold rounded-xl px-4 py-3.5 text-sm hover:bg-foreground/90 transition-all shadow-md active:scale-[0.98] disabled:opacity-70">
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
