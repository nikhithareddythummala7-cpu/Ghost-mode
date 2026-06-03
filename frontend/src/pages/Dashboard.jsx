import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, Clock3, Send, HardDrive, Users } from 'lucide-react';
import AuthenticatedLayout from '../layouts/AuthenticatedLayout';
import { useAuth } from '../context/AuthContext';
import { getCapsules, getMessages, getContacts, getVault } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const statCards = [
  { label: 'Capsules', value: 'capsules', icon: Layers, accent: 'from-neon-blue to-sky-500' },
  { label: 'Pending Messages', value: 'messages', icon: Send, accent: 'from-neon-violet to-fuchsia-500' },
  { label: 'Memory Items', value: 'memories', icon: HardDrive, accent: 'from-teal-400 to-cyan-500' },
  { label: 'Contacts', value: 'contacts', icon: Users, accent: 'from-orange-400 to-rose-500' }
];

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ capsules: 0, messages: 0, contacts: 0, memories: 0 });
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSummary = async () => {
      setLoading(true);
      try {
        const [capsuleRes, messageRes, contactRes, vaultRes] = await Promise.all([getCapsules(), getMessages(), getContacts(), getVault()]);
        setStats({
          capsules: capsuleRes.data.length,
          messages: messageRes.data.filter((item) => item.status === 'pending').length,
          contacts: contactRes.data.length,
          memories: vaultRes.data.length
        });
        setUpcoming(messageRes.data.filter((item) => item.status === 'pending').slice(0, 4));
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };
    loadSummary();
  }, []);

  return (
    <AuthenticatedLayout title="Dashboard">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-8">
          <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="grid gap-6 xl:grid-cols-3">
            <div className="glass-card p-8">
              <p className="text-sm uppercase tracking-[0.35em] text-neon-blue">Legacy Pulse</p>
              <h2 className="mt-4 text-3xl font-semibold text-white">Good evening, {user?.name?.split(' ')[0] || 'Ghost'}</h2>
              <p className="mt-4 text-sm leading-6 text-slate-400">Your mission control for future deliveries, vault archives, and emergency readiness.</p>
            </div>
            <div className="glass-card p-6">
              <p className="text-sm uppercase tracking-[0.35em] text-neon-violet">Time to next dispatch</p>
              <div className="mt-4 text-5xl font-semibold text-white">2d 18h</div>
              <p className="mt-3 text-sm text-slate-400">Your next time capsule unlocks soon.</p>
            </div>
            <div className="glass-card p-6">
              <p className="text-sm uppercase tracking-[0.35em] text-teal-400">Vault health</p>
              <div className="mt-4 text-5xl font-semibold text-white">97%</div>
              <p className="mt-3 text-sm text-slate-400">Secure backups and archive integrity are stable.</p>
            </div>
          </motion.section>

          <section className="grid gap-6 xl:grid-cols-4">
            {statCards.map((card) => {
              const Icon = card.icon;
              return (
                <motion.div key={card.label} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="glass-card p-6">
                  <div className={`inline-flex items-center justify-center rounded-3xl bg-gradient-to-br ${card.accent} p-3 text-slate-950`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="mt-4 text-sm uppercase tracking-[0.35em] text-slate-400">{card.label}</p>
                  <p className="mt-3 text-4xl font-semibold text-white">{stats[card.value]}</p>
                </motion.div>
              );
            })}
          </section>

          <section className="grid gap-6 xl:grid-cols-[0.65fr_0.35fr]">
            <div className="glass-card p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-neon-blue">Time Capsule Timeline</p>
                  <h2 className="mt-3 text-2xl font-semibold text-white">Active missions</h2>
                </div>
                <Clock3 className="h-6 w-6 text-neon-blue" />
              </div>
              <div className="mt-6 space-y-4">
                {upcoming.map((item) => (
                  <div key={item._id} className="rounded-[28px] border border-white/10 bg-slate-950/70 p-4">
                    <div className="flex items-center justify-between gap-4 text-sm text-slate-400">
                      <span>{item.recipientEmail}</span>
                      <span className="rounded-full bg-white/5 px-3 py-1 text-white">{item.status}</span>
                    </div>
                    <h3 className="mt-3 text-lg font-semibold text-white">{item.subject}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">Deliver on {new Date(item.deliveryDate).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-6">
              <p className="text-sm uppercase tracking-[0.35em] text-neon-violet">Vault status</p>
              <div className="mt-6 space-y-4">
                <div className="rounded-[28px] bg-slate-900/70 p-5">
                  <p className="text-sm text-slate-400">Saved memories</p>
                  <p className="mt-3 text-3xl font-semibold text-white">{stats.memories}</p>
                </div>
                <div className="rounded-[28px] bg-slate-900/70 p-5">
                  <p className="text-sm text-slate-400">Trusted contacts</p>
                  <p className="mt-3 text-3xl font-semibold text-white">{stats.contacts}</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </AuthenticatedLayout>
  );
};

export default Dashboard;
