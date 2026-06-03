import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Users, Layers, MessageSquare, Flag, Database, Clock3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAdminStats, getAdminUsers, getAdminCapsules, getAdminMessages } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useToast } from '../../context/ToastContext';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentCapsules, setRecentCapsules] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      try {
        const [{ data: statsData }, { data: usersData }, { data: capsulesData }, { data: messagesData }] = await Promise.all([
          getAdminStats(),
          getAdminUsers({}),
          getAdminCapsules({}),
          getAdminMessages({})
        ]);

        setStats(statsData);
        setRecentUsers(usersData.slice(0, 5));
        setRecentCapsules(capsulesData.slice(0, 5));
        setRecentMessages(messagesData.slice(0, 5));
      } catch (error) {
        showToast('Unable to load admin dashboard', 'error');
      }
      setLoading(false);
    };

    loadDashboard();
  }, [showToast]);

  const cards = [
    { label: 'Total Users', value: stats?.totalUsers, icon: Users, accent: 'from-neon-blue to-sky-500' },
    { label: 'Active Users', value: stats?.activeUsers, icon: ShieldCheck, accent: 'from-emerald-400 to-teal-500' },
    { label: 'Disabled Users', value: stats?.disabledUsers, icon: Flag, accent: 'from-rose-500 to-fuchsia-500' },
    { label: 'Total Capsules', value: stats?.totalCapsules, icon: Layers, accent: 'from-violet-500 to-indigo-500' },
    { label: 'Scheduled Messages', value: stats?.totalMessages, icon: MessageSquare, accent: 'from-orange-400 to-amber-500' },
    { label: 'Pending Messages', value: stats?.pendingMessages, icon: Clock3, accent: 'from-cyan-400 to-blue-500' },
    { label: 'Flagged Messages', value: stats?.flaggedMessages, icon: Flag, accent: 'from-rose-500 to-pink-500' },
    { label: 'Storage Usage', value: `${Math.round(stats?.storageUsage / 1024) || 0} KB`, icon: Database, accent: 'from-slate-400 to-slate-600' }
  ];

  return (
    <div className="space-y-8">
      {loading || !stats ? (
        <LoadingSpinner />
      ) : (
        <>
          <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="glass-card p-8">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-neon-blue">Admin command</p>
                <h1 className="mt-3 text-3xl font-semibold text-white">Platform control center</h1>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400">Monitor active users, vault activity, and flagged moderation from the premium GhostMode dashboard.</p>
              </div>
              <Link to="/admin/settings" className="inline-flex items-center gap-2 rounded-full bg-neon-violet px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-violet-500">
                Manage settings
              </Link>
            </div>
          </motion.section>

          <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => {
              const Icon = card.icon;
              return (
                <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="glass-card p-6">
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br ${card.accent} text-slate-950`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="mt-5 text-sm uppercase tracking-[0.35em] text-slate-400">{card.label}</p>
                  <p className="mt-3 text-3xl font-semibold text-white">{card.value}</p>
                </motion.div>
              );
            })}
          </section>

          <section className="grid gap-6 xl:grid-cols-3">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="glass-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-neon-blue">Recent users</p>
                  <h2 className="mt-2 text-xl font-semibold text-white">Latest signups</h2>
                </div>
                <Link to="/admin/users" className="text-neon-violet hover:text-white">View all</Link>
              </div>
              <div className="mt-5 space-y-4">
                {recentUsers.map((user) => (
                  <div key={user._id} className="rounded-3xl bg-slate-950/80 p-4">
                    <p className="font-semibold text-white">{user.name}</p>
                    <p className="text-sm text-slate-400">{user.email}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }} className="glass-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-neon-blue">Recent capsules</p>
                  <h2 className="mt-2 text-xl font-semibold text-white">Latest vault activity</h2>
                </div>
                <Link to="/admin/capsules" className="text-neon-violet hover:text-white">View all</Link>
              </div>
              <div className="mt-5 space-y-4">
                {recentCapsules.map((capsule) => (
                  <div key={capsule._id} className="rounded-3xl bg-slate-950/80 p-4">
                    <p className="font-semibold text-white">ID • {capsule._id.slice(-6)}</p>
                    <p className="text-sm text-slate-400">Owner: {capsule.userId?.name || 'Unknown'}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="glass-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-neon-blue">Recent messages</p>
                  <h2 className="mt-2 text-xl font-semibold text-white">Latest dispatches</h2>
                </div>
                <Link to="/admin/messages" className="text-neon-violet hover:text-white">View all</Link>
              </div>
              <div className="mt-5 space-y-4">
                {recentMessages.map((message) => (
                  <div key={message._id} className="rounded-3xl bg-slate-950/80 p-4">
                    <p className="font-semibold text-white">ID • {message._id.slice(-6)}</p>
                    <p className="text-sm text-slate-400">Recipient: {message.recipientEmail}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </section>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
