import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock3, Archive, Trash2 } from 'lucide-react';
import AuthenticatedLayout from '../layouts/AuthenticatedLayout';
import { getCapsules, deleteCapsule } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { useToast } from '../context/ToastContext';

const getCountdown = (unlockDate) => {
  const diff = new Date(unlockDate).getTime() - Date.now();
  if (diff <= 0) return 'Unlocked';
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  return `${days}d ${hours}h`;
};

const Capsules = () => {
  const [capsules, setCapsules] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const loadCapsules = async () => {
      setLoading(true);
      try {
        const { data } = await getCapsules();
        setCapsules(data);
      } catch (error) {
        showToast('Unable to load capsules', 'error');
      }
      setLoading(false);
    };
    loadCapsules();
  }, []);

  const removeCapsule = async (id) => {
    try {
      await deleteCapsule(id);
      setCapsules((prev) => prev.filter((item) => item._id !== id));
      showToast('Capsule deleted');
    } catch (error) {
      showToast('Could not delete capsule', 'error');
    }
  };

  return (
    <AuthenticatedLayout title="Time Capsules">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-neon-blue">Time Capsules</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">Launch your future memories.</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">Create cinematic capsules for future unlocks with elegant timelines and countdowns.</p>
        </div>
        <Link to="/capsules/new" className="inline-flex items-center gap-2 rounded-full bg-neon-violet px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-violet-500">
          <Archive className="h-4 w-4" /> Create new capsule
        </Link>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : capsules.length ? (
        <div className="grid gap-6 xl:grid-cols-2">
          {capsules.map((capsule, index) => (
            <motion.div key={capsule._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="glass-card p-6">
              <div className="flex items-center justify-between gap-4">
                <span className="rounded-3xl bg-white/5 px-4 py-2 text-sm text-slate-200">{capsule.status}</span>
                <span className="inline-flex items-center gap-2 rounded-full bg-neon-blue/10 px-3 py-1 text-xs uppercase tracking-[0.35em] text-neon-blue"><Clock3 className="h-3.5 w-3.5" /> {getCountdown(capsule.unlockDate)}</span>
              </div>
              <h3 className="mt-6 text-2xl font-semibold text-white">{capsule.title}</h3>
              <p className="mt-4 text-sm leading-6 text-slate-400">{capsule.message}</p>
              <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-400">
                <span>Unlocks: {new Date(capsule.unlockDate).toLocaleDateString()}</span>
                <span className="rounded-full bg-white/5 px-3 py-1">{capsule.visibility || 'Private'}</span>
              </div>
              <button onClick={() => removeCapsule(capsule._id)} className="mt-6 inline-flex items-center gap-2 rounded-full bg-rose-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-400">
                <Trash2 className="h-4 w-4" /> Delete capsule
              </button>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="rounded-[32px] border border-dashed border-white/15 bg-slate-950/70 p-12 text-center text-slate-400">
          <p className="text-lg font-semibold text-white">No time capsules yet.</p>
          <p className="mt-3 text-sm">Create your first capsule and begin the GhostMode journey.</p>
        </div>
      )}
    </AuthenticatedLayout>
  );
};

export default Capsules;
