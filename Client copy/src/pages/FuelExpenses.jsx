import PageLayout from '../components/PageLayout';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import api from '../utils/api';

export default function FuelExpenses() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await api.get('/fuel-logs');
        setLogs(response.data.data);
      } catch (error) {
        console.error('Failed to fetch fuel logs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);
  return (
    <PageLayout 
      title="Fuel & Expenses" 
      action={<button className="bg-foreground text-background font-bold px-4 py-2.5 text-sm rounded-xl hover:bg-foreground/90 transition-all shadow-md active:scale-95">+ Log Fuel</button>}
    >
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-mutedForeground border-b border-border">
                <th className="pb-3 font-medium px-2">Log ID</th>
                <th className="pb-3 font-medium">Vehicle</th>
                <th className="pb-3 font-medium">Driver</th>
                <th className="pb-3 font-medium">Amount (L)</th>
                <th className="pb-3 font-medium">Cost (₹)</th>
                <th className="pb-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="text-foreground">
              {loading ? (
                <tr><td colSpan="6" className="py-4 text-center text-mutedForeground">Loading logs...</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan="6" className="py-4 text-center text-mutedForeground">No fuel logs found</td></tr>
              ) : (
                logs.map((log, i) => (
                  <motion.tr 
                    key={log.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    className="border-b border-border/40 hover:bg-muted/30 transition-colors group"
                  >
                    <td className="py-4 px-2 font-mono text-xs">#FL-{log.id}</td>
                    <td className="py-4 font-medium group-hover:text-primary transition-colors">{log.vehicle?.nameModel || 'N/A'}</td>
                    <td className="py-4 text-mutedForeground">N/A</td>
                    <td className="py-4 font-medium text-primary">{log.liters}</td>
                    <td className="py-4 font-bold">{log.cost}</td>
                    <td className="py-4 text-mutedForeground">{new Date(log.date).toLocaleDateString()}</td>
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
