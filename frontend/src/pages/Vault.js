import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, Database, Trash2, Sparkles } from 'lucide-react';
import AuthenticatedLayout from '../layouts/AuthenticatedLayout';
import { getVault, uploadVaultItem, deleteVaultItem } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { useToast } from '../context/ToastContext';

const Vault = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', fileType: 'photo' });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const loadVault = async () => {
      try {
        const { data } = await getVault();
        setItems(data);
      } catch (error) {
        showToast('Unable to load vault', 'error');
      }
      setLoading(false);
    };
    loadVault();
  }, [showToast]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      return showToast('Please select a file', 'error');
    }
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('fileType', form.fileType);
    formData.append('file', file);

    try {
      const { data } = await uploadVaultItem(formData);
      setItems((prev) => [data, ...prev]);
      setForm({ title: '', description: '', fileType: 'photo' });
      setFile(null);
      showToast('Media uploaded');
    } catch (error) {
      showToast('Unable to upload file', 'error');
    }
  };

  const removeItem = async (id) => {
    try {
      await deleteVaultItem(id);
      setItems((prev) => prev.filter((item) => item._id !== id));
      showToast('Vault item deleted');
    } catch (error) {
      showToast('Could not delete item', 'error');
    }
  };

  return (
    <AuthenticatedLayout title="Memory Vault">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="glass-card p-8">
          <div className="flex items-center gap-3 text-neon-blue">
            <UploadCloud className="h-5 w-5" />
            <p className="text-sm uppercase tracking-[0.35em]">Upload new memory</p>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-400">Add photos, documents, videos or notes into your private vault. Every upload is secured and time-stamped for legacy access.</p>
          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <label className="block">
              <span className="block text-sm font-medium text-slate-300">Title</span>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} type="text" required />
            </label>
            <label className="block">
              <span className="block text-sm font-medium text-slate-300">Description</span>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows="3" className="min-h-[92px]" />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="block text-sm font-medium text-slate-300">Type</span>
                <select value={form.fileType} onChange={(e) => setForm({ ...form, fileType: e.target.value })}>
                  <option value="photo">Photo</option>
                  <option value="video">Video</option>
                  <option value="document">Document</option>
                  <option value="note">Note</option>
                </select>
              </label>
              <label className="block">
                <span className="block text-sm font-medium text-slate-300">File</span>
                <input type="file" onChange={(e) => setFile(e.target.files[0])} required />
              </label>
            </div>
            <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-neon-blue px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">
              Upload memory
            </button>
          </form>
        </div>

        <div className="glass-card p-8">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-neon-violet">Vault overview</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Memory archive</h2>
            </div>
            <Database className="h-6 w-6 text-neon-violet" />
          </div>
          <div className="mt-8 space-y-4">
            <div className="rounded-[28px] bg-slate-950/70 p-5">
              <p className="text-sm text-slate-400">Items stored</p>
              <p className="mt-3 text-4xl font-semibold text-white">{items.length}</p>
            </div>
            <div className="rounded-[28px] bg-slate-950/70 p-5">
              <p className="text-sm text-slate-400">Recent activity</p>
              <p className="mt-3 text-sm text-slate-300">Your vault is ready to store and preserve the next chapter.</p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="mt-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-neon-blue">Stored memories</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">A living archive</h2>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm text-slate-300">
            <Sparkles className="h-4 w-4 text-neon-blue" /> Forever preserved
          </span>
        </div>
        {loading ? (
          <LoadingSpinner />
        ) : items.length ? (
          <div className="grid gap-6 xl:grid-cols-3">
            {items.map((item) => (
              <div key={item._id} className="glass-card p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-400">{item.fileType}</p>
                  <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">Secure</span>
                </div>
                <h3 className="mt-4 text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">{item.description || 'No description added'}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <a href={item.fileUrl} target="_blank" rel="noreferrer" className="rounded-full border border-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/10">Open</a>
                  <button onClick={() => removeItem(item._id)} className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-400">
                    <Trash2 className="h-4 w-4" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-[32px] border border-dashed border-white/15 bg-slate-950/70 p-12 text-center text-slate-400">
            <p className="text-lg font-semibold text-white">No memories stored yet.</p>
            <p className="mt-3 text-sm">Add your first item to begin your vault journey.</p>
          </div>
        )}
      </motion.section>
    </AuthenticatedLayout>
  );
};

export default Vault;
