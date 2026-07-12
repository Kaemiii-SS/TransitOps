import PageLayout from '../components/PageLayout';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import api from '../utils/api';

export default function Maintenance() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await api.get('/maintenance');
        setLogs(response.data.data);
      } catch (error) {
        console.error('Failed to fetch maintenance logs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);
  return (
    <PageLayout 
      title="Maintenance Logs" 
      action={<button className="bg-foreground text-background font-bold px-4 py-2.5 text-sm rounded-xl hover:bg-foreground/90 transition-all shadow-md active:scale-95">+ Log Maintenance</button>}
    >
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-mutedForeground border-b border-border">
                <th className="pb-3 font-medium px-2">Log ID</th>
                <th className="pb-3 font-medium">Vehicle</th>
                <th className="pb-3 font-medium">Description</th>
                <th className="pb-3 font-medium">Cost (₹)</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="text-foreground">
              {loading ? (
                <tr><td colSpan="7" className="py-4 text-center text-mutedForeground">Loading logs...</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan="7" className="py-4 text-center text-mutedForeground">No maintenance logs found</td></tr>
              ) : (
                logs.map((log, i) => (
                  <motion.tr 
                    key={log.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    className="border-b border-border/40 hover:bg-muted/30 transition-colors group"
                  >
                    <td className="py-4 px-2 font-mono text-xs">#ML-{log.id}</td>
                    <td className="py-4 font-medium group-hover:text-primary transition-colors">{log.vehicle?.nameModel || 'N/A'}</td>
                    <td className="py-4 text-mutedForeground">{log.description}</td>
                    <td className="py-4 font-mono">{log.cost}</td>
                    <td className="py-4 text-mutedForeground">{new Date(log.createdAt).toLocaleDateString()}</td>
                    <td className="py-4">
                      {log.status === 'ACTIVE' && <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold bg-destructive/10 text-destructive border border-destructive/20 tracking-wide uppercase">Active</span>}
                      {log.status === 'CLOSED' && <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold bg-muted text-mutedForeground border border-border tracking-wide uppercase">Closed</span>}
                    </td>
                    <td className="py-4">
                      {log.status === 'ACTIVE' ? (
                        <button className="text-[11px] font-bold uppercase tracking-wider text-background bg-primary hover:bg-primary/90 px-3 py-1.5 rounded-md transition-colors active:scale-95">Close Job</button>
                      ) : (
                        <span className="text-mutedForeground">--</span>
                      )}
                    </td>
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
