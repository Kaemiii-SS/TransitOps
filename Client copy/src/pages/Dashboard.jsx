import PageLayout from '../components/PageLayout';
import { Truck, MapPin, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import api from '../utils/api';

export default function Dashboard() {
  const [kpis, setKpis] = useState(null);
  const [recentTrips, setRecentTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [kpiRes, tripsRes] = await Promise.all([
          api.get('/dashboard/kpis'),
          api.get('/trips')
        ]);
        setKpis(kpiRes.data.data);
        const activeOrRecent = tripsRes.data.data.filter(t => t.status !== 'DRAFT').slice(0, 5);
        setRecentTrips(activeOrRecent);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const KPI_DATA = kpis ? [
    { label: 'Active Vehicles', value: kpis.activeVehicles, icon: Truck, color: 'text-primary' },
    { label: 'Vehicles on Trip', value: kpis.activeTrips, icon: MapPin, color: 'text-foreground' },
    { label: 'In Shop (Maint)', value: kpis.vehiclesInMaintenance, icon: AlertCircle, color: 'text-destructive' },
    { label: 'Available', value: kpis.availableVehicles, icon: CheckCircle2, color: 'text-mutedForeground' },
  ] : [];

  if (loading) return <PageLayout title="Overview"><div className="flex h-64 items-center justify-center">Loading dashboard...</div></PageLayout>;
  return (
    <PageLayout title="Overview">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
        {KPI_DATA.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="bg-card border border-border rounded-2xl p-5 hover:border-border/80 transition-colors shadow-sm flex flex-col justify-between h-36"
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-mutedForeground uppercase tracking-wider">{kpi.label}</span>
                <Icon size={18} className={kpi.color} />
              </div>
              <div className="text-4xl font-bold tracking-tighter text-foreground">{kpi.value}</div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">Recent Trips</h2>
            <button className="text-sm font-medium text-primary hover:underline">View all</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-mutedForeground border-b border-border">
                  <th className="pb-3 font-medium px-2">Trip ID</th>
                  <th className="pb-3 font-medium">Vehicle</th>
                  <th className="pb-3 font-medium">Destination</th>
                  <th className="pb-3 font-medium text-right pr-2">Status</th>
                </tr>
              </thead>
              <tbody className="text-foreground">
                {recentTrips.length === 0 && (
                  <tr><td colSpan="4" className="py-4 text-center text-mutedForeground">No recent trips found</td></tr>
                )}
                {recentTrips.map(trip => (
                  <tr key={trip.id} className="border-b border-border/40 hover:bg-muted/30 transition-colors group last:border-0">
                    <td className="py-4 px-2 font-mono text-xs">#TRP-{trip.id}</td>
                    <td className="py-4 font-medium group-hover:text-primary transition-colors">{trip.vehicle?.nameModel || 'N/A'}</td>
                    <td className="py-4 text-mutedForeground">{trip.destination}</td>
                    <td className="py-4 text-right pr-2">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase ${trip.status === 'COMPLETED' ? 'bg-muted text-mutedForeground border border-border' : 'bg-primary/10 text-primary border border-primary/20'}`}>
                        {trip.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col">
          <h2 className="text-lg font-semibold tracking-tight text-foreground mb-6">Vehicle Status</h2>
          <div className="flex-1 flex flex-col justify-center gap-8">
            <div>
              <div className="flex justify-between text-sm mb-3">
                <span className="text-mutedForeground font-medium">On Trip</span>
                <span className="font-bold text-foreground">{kpis ? kpis.fleetUtilizationPercent : 0}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${kpis ? kpis.fleetUtilizationPercent : 0}%` }} transition={{ duration: 1, ease: 'easeOut' }} className="h-full bg-primary rounded-full"></motion.div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-3">
                <span className="text-mutedForeground font-medium">In Shop</span>
                <span className="font-bold text-foreground">{kpis && kpis.activeVehicles ? Math.round((kpis.vehiclesInMaintenance / kpis.activeVehicles) * 100) : 0}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${kpis && kpis.activeVehicles ? (kpis.vehiclesInMaintenance / kpis.activeVehicles) * 100 : 0}%` }} transition={{ duration: 1, ease: 'easeOut', delay: 0.1 }} className="h-full bg-destructive/80 rounded-full"></motion.div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-3">
                <span className="text-mutedForeground font-medium">Available</span>
                <span className="font-bold text-foreground">{kpis && kpis.activeVehicles ? Math.round((kpis.availableVehicles / kpis.activeVehicles) * 100) : 0}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${kpis && kpis.activeVehicles ? (kpis.availableVehicles / kpis.activeVehicles) * 100 : 0}%` }} transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }} className="h-full bg-mutedForeground/40 rounded-full"></motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
