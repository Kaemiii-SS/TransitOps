import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full relative z-50 bg-background/80 backdrop-blur-md sticky top-0 border-b border-border/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-md">
            <span className="text-xl font-black text-background tracking-tighter">TO</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">TransitOps</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => scrollToSection('services')} className="text-sm font-semibold text-mutedForeground hover:text-foreground transition-colors">Services</button>
          <button onClick={() => scrollToSection('about')} className="text-sm font-semibold text-mutedForeground hover:text-foreground transition-colors">About Us</button>
          <button onClick={() => scrollToSection('contact')} className="text-sm font-semibold text-mutedForeground hover:text-foreground transition-colors">Contact Us</button>
        </div>
        <button 
          onClick={() => navigate('/login')}
          className="bg-card text-foreground border border-border hover:border-primary/50 font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm"
        >
          Sign In
        </button>
      </nav>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="min-h-[85vh] flex items-center justify-center relative px-6 text-center z-10 pt-10">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-foreground leading-[1.1] mb-6">
                The Smart Way to <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
                  Manage Your Fleet.
                </span>
              </h1>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg md:text-xl text-mutedForeground mb-10 max-w-2xl mx-auto font-medium"
            >
              Optimize routes, track maintenance, and streamline operations with our comprehensive transport management platform designed for modern logistics.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center justify-center"
            >
              <button 
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto bg-foreground text-background font-bold px-10 py-4 rounded-xl hover:bg-foreground/90 transition-all shadow-lg active:scale-[0.98] text-lg"
              >
                Get Started
              </button>
            </motion.div>
          </div>

          <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] opacity-50 mix-blend-screen"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-accent rounded-full blur-[120px] opacity-30 mix-blend-screen"></div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-24 px-6 bg-card border-y border-border">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4">Our Services</h2>
              <p className="text-mutedForeground max-w-2xl mx-auto">Everything you need to run your logistics operations smoothly.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-background p-6 rounded-2xl border border-border">
                <h3 className="text-xl font-bold text-foreground mb-3 text-primary">Auth & Access</h3>
                <ul className="text-mutedForeground text-sm space-y-2 list-disc list-inside">
                  <li>Signup / Login / Logout</li>
                  <li>Secure Role-based Access</li>
                  <li>Current user sessions</li>
                </ul>
              </div>
              <div className="bg-background p-6 rounded-2xl border border-border">
                <h3 className="text-xl font-bold text-foreground mb-3 text-primary">Fleet Management</h3>
                <ul className="text-mutedForeground text-sm space-y-2 list-disc list-inside">
                  <li>Register & manage vehicles</li>
                  <li>Filter by type, status, region</li>
                  <li>Track operational costs (fuel, maint, acquisition)</li>
                </ul>
              </div>
              <div className="bg-background p-6 rounded-2xl border border-border">
                <h3 className="text-xl font-bold text-foreground mb-3 text-primary">Drivers</h3>
                <ul className="text-mutedForeground text-sm space-y-2 list-disc list-inside">
                  <li>Register & track drivers</li>
                  <li>Filter by availability & license</li>
                  <li>Suspend/Delete records</li>
                </ul>
              </div>
              <div className="bg-background p-6 rounded-2xl border border-border">
                <h3 className="text-xl font-bold text-foreground mb-3 text-primary">Trips & Dispatch</h3>
                <ul className="text-mutedForeground text-sm space-y-2 list-disc list-inside">
                  <li>Create draft trips</li>
                  <li>Dispatch with capacity/license checks</li>
                  <li>Complete trips with actuals (distance, fuel, revenue)</li>
                </ul>
              </div>
              <div className="bg-background p-6 rounded-2xl border border-border">
                <h3 className="text-xl font-bold text-foreground mb-3 text-primary">Maintenance</h3>
                <ul className="text-mutedForeground text-sm space-y-2 list-disc list-inside">
                  <li>Open maintenance records</li>
                  <li>Automatically take vehicles out of service</li>
                  <li>Track costs and close records</li>
                </ul>
              </div>
              <div className="bg-background p-6 rounded-2xl border border-border">
                <h3 className="text-xl font-bold text-foreground mb-3 text-primary">Fuel, Expenses & Analytics</h3>
                <ul className="text-mutedForeground text-sm space-y-2 list-disc list-inside">
                  <li>Log fuel and route expenses</li>
                  <li>View Fleet utilization %</li>
                  <li>Per-vehicle ROI & fuel efficiency</li>
                  <li>Export full CSV reports</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section id="about" className="py-24 px-6 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-6">About Us</h2>
            <div className="bg-card border border-border rounded-3xl p-10 md:p-16 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-accent"></div>
              <p className="text-xl md:text-2xl font-medium text-foreground mb-8 leading-relaxed">
                We are a dedicated team from <span className="font-black text-primary">NIT Jamshedpur</span>.
              </p>
              <div className="text-left max-w-sm mx-auto">
                <h4 className="text-sm font-bold uppercase tracking-widest text-mutedForeground mb-4 text-center">Team Members</h4>
                <ul className="space-y-4">
                  <li className="flex items-center gap-4 bg-background p-3 rounded-xl border border-border">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">SS</div>
                    <span className="font-semibold text-lg text-foreground">Suryam Singh</span>
                  </li>
                  <li className="flex items-center gap-4 bg-background p-3 rounded-xl border border-border">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">SB</div>
                    <span className="font-semibold text-lg text-foreground">Shrutika Baranwal</span>
                  </li>
                  <li className="flex items-center gap-4 bg-background p-3 rounded-xl border border-border">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">RR</div>
                    <span className="font-semibold text-lg text-foreground">Ronit Raj</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Us Section */}
        <section id="contact" className="py-24 px-6 bg-card border-t border-border">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-6">Contact Us</h2>
            <p className="text-lg text-mutedForeground mb-8">
              Have any questions, feature requests, or need support? We'd love to hear from you.
            </p>
            <div className="inline-flex items-center gap-3 bg-background border border-border px-6 py-4 rounded-full shadow-sm hover:border-primary/50 transition-colors">
              <span className="text-mutedForeground font-medium">For any queries, contact:</span>
              <a href="mailto:suryam1802singh@gmail.com" className="font-bold text-primary hover:underline">
                suryam1802singh@gmail.com
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
