import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Clock3, ShieldCheck, Layers } from 'lucide-react';

const features = [
  { title: 'Encrypted Memory Vault', description: 'Preserve photos, notes, and videos in a vault built for future generations.', icon: ShieldCheck },
  { title: 'Scheduled Legacy Messages', description: 'Deliver voice and text into the future with precise timing.', icon: Clock3 },
  { title: 'Time Capsule Timeline', description: 'Track every locked memory with a cinematic timeline experience.', icon: Layers }
];

const LandingPage = () => (
  <main className="relative overflow-hidden px-4 pb-20 pt-16 sm:px-6 lg:px-8">
    <div className="absolute inset-x-0 top-0 h-[28rem] bg-hero-grid opacity-70 blur-3xl" />
    <div className="glass-card mx-auto max-w-7xl overflow-hidden border-white/10 p-10 shadow-panel backdrop-blur-2xl">
      <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <p className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm uppercase tracking-[0.35em] text-neon-blue">
            <Sparkles className="h-4 w-4" /> Futuristic legacy
          </p>
          <h1 className="mt-8 max-w-2xl text-5xl font-semibold leading-tight text-white sm:text-6xl">GhostMode is the future of digital legacy.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">Unlock a premium platform designed to protect your memories, manage emergency contacts, and send messages across time with cinematic precision.</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link to="/register" className="inline-flex items-center justify-center rounded-full bg-neon-blue px-7 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">
              Start your legacy
            </Link>
            <Link to="/login" className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
              Sign in
            </Link>
          </div>
        </motion.section>

        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9 }} className="space-y-6 rounded-[32px] border border-white/10 bg-slate-950/90 p-8 shadow-glow">
          <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-white/5 via-white/10 to-white/5 p-6">
            <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Legacy estimate</p>
            <h2 className="mt-4 text-4xl font-semibold text-white">4.9M hours</h2>
            <p className="mt-3 text-sm text-slate-400">of future content preserved across the GhostMode network.</p>
          </div>
          <div className="grid gap-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="flex gap-4 rounded-3xl border border-white/10 bg-slate-900/80 p-5">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-neon-violet/10 text-neon-violet">
                    <Icon className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                    <p className="mt-2 text-sm text-slate-400">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
    <div className="mx-auto mt-16 max-w-6xl text-center text-slate-400">
      <p className="text-sm uppercase tracking-[0.3em]">GhostMode · Premium legacy platform</p>
    </div>
  </main>
);

export default LandingPage;
