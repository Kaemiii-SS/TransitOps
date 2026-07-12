import PageLayout from '../components/PageLayout';
import { motion } from 'framer-motion';

export default function Settings() {
  return (
    <PageLayout title="Settings & Preferences">
      <div className="max-w-3xl space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold tracking-tight text-foreground mb-6">Profile Configuration</h2>
          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-bold text-mutedForeground uppercase tracking-widest mb-2">Display Name</label>
              <input type="text" defaultValue="Raven K." className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-bold text-mutedForeground uppercase tracking-widest mb-2">Email Address</label>
              <input type="email" defaultValue="raven.k@transitops.in" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all" />
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold tracking-tight text-foreground mb-2">Role-Based Access Control</h2>
          <p className="text-sm text-mutedForeground mb-6">Select a role below to simulate how the frontend restricts access based on user permissions.</p>
          
          <div className="space-y-3">
            {[
              { id: 'fleet_manager', title: 'Fleet Manager', desc: 'Full access to Fleet, Drivers, and Maintenance. Can view Analytics. Cannot create Trips.' },
              { id: 'dispatcher', title: 'Dispatcher', desc: 'Full access to Trips and live dashboard. Can view available Fleet. Cannot edit Maintenance.', checked: true },
              { id: 'safety_officer', title: 'Safety Officer', desc: 'Full access to Drivers and compliance data. Cannot dispatch or view financials.' },
              { id: 'financial_analyst', title: 'Financial Analyst', desc: 'Full access to Analytics, Fuel Logs, and Expenses. Cannot manage physical fleet or drivers.' },
            ].map((role) => (
              <label key={role.id} className="flex items-start gap-4 p-4 border border-border rounded-xl cursor-pointer hover:bg-muted/30 transition-colors group">
                <input type="radio" name="rbac" defaultChecked={role.checked} className="mt-1 accent-primary w-4 h-4" />
                <div>
                  <div className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{role.title}</div>
                  <div className="text-xs text-mutedForeground mt-1 leading-relaxed">{role.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <button className="bg-foreground text-background font-bold px-6 py-3 text-sm rounded-xl hover:bg-foreground/90 transition-all shadow-md active:scale-95">Save Changes</button>
        </motion.div>
      </div>
    </PageLayout>
  );
}
