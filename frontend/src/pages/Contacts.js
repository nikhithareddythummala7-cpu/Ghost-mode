import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Mail, HeartPulse, Phone, Edit3, Trash2 } from 'lucide-react';
import AuthenticatedLayout from '../layouts/AuthenticatedLayout';
import { getContacts, createContact, updateContact, deleteContact } from '../services/api';
import { useToast } from '../context/ToastContext';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', relationship: '', Mobile: '' });
  const [editingId, setEditingId] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    const loadContacts = async () => {
      try {
        const { data } = await getContacts();
        setContacts(data);
      } catch (error) {
        showToast('Unable to load contacts', 'error');
      }
    };
    loadContacts();
  }, [showToast]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editingId) {
        const { data } = await updateContact(editingId, form);
        setContacts((prev) => prev.map((item) => (item._id === editingId ? data : item)));
        showToast('Contact updated');
      } else {
        const { data } = await createContact(form);
        setContacts((prev) => [data, ...prev]);
        showToast('Contact added');
      }
      setForm({ name: '', email: '', relationship: '', Mobile: '' });
      setEditingId(null);
    } catch (error) {
      showToast('Unable to save contact', 'error');
    }
  };

  const editContact = (contact) => {
    setForm({ name: contact.name, email: contact.email, relationship: contact.relationship, Mobile: contact.Mobile });
    setEditingId(contact._id);
  };

  const removeContact = async (id) => {
    try {
      await deleteContact(id);
      setContacts((prev) => prev.filter((item) => item._id !== id));
      showToast('Contact removed');
    } catch (error) {
      showToast('Unable to remove contact', 'error');
    }
  };

  return (
    <AuthenticatedLayout title="Emergency Contacts">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="glass-card p-8">
          <div className="flex items-center gap-3 text-neon-blue">
            <UserPlus className="h-5 w-5" />
            <p className="text-sm uppercase tracking-[0.35em]">Trusted circle</p>
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-white">Add or update a guardian</h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">Keep your emergency contact list current for future delivery triggers.</p>
          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm text-slate-300"><UserPlus className="h-4 w-4" /> Name</span>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} type="text" required />
            </label>
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm text-slate-300"><Mail className="h-4 w-4" /> Email address</span>
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" required />
            </label>
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm text-slate-300"><HeartPulse className="h-4 w-4" /> Relationship</span>
              <input value={form.relationship} onChange={(e) => setForm({ ...form, relationship: e.target.value })} type="text" required />
            </label>
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm text-slate-300"><Phone className="h-4 w-4" /> Mobile</span>
              <input value={form.Mobile} onChange={(e) => setForm({ ...form, Mobile: e.target.value })} type="tel" required />
            </label>
            <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-neon-violet px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-violet-500">
              {editingId ? 'Update contact' : 'Add contact'}
            </button>
          </form>
        </div>

        <div className="glass-card p-8">
          <p className="text-sm uppercase tracking-[0.35em] text-neon-blue">Resource pulse</p>
          <h2 className="mt-4 text-2xl font-semibold text-white">Your trusted network</h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">Emergency contacts are the backbone of your future dispatch chain.</p>
          <div className="mt-8 rounded-[28px] bg-slate-950/70 p-5">
            <p className="text-sm text-slate-400">Total guardians</p>
            <p className="mt-3 text-4xl font-semibold text-white">{contacts.length}</p>
          </div>
        </div>
      </motion.div>

      <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="mt-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-neon-blue">Contact vault</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Trusted profiles</h2>
          </div>
        </div>
        {contacts.length ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {contacts.map((contact) => (
              <div key={contact._id} className="glass-card p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-slate-400">{contact.relationship}</p>
                    <h3 className="mt-3 text-xl font-semibold text-white">{contact.name}</h3>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-neon-blue/10 px-3 py-1 text-sm text-neon-blue">Verified</div>
                </div>
                <p className="mt-4 text-sm text-slate-400">{contact.email}</p>
                <p className="mt-2 text-sm text-slate-400">{contact.Mobile}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <button onClick={() => editContact(contact)} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/5">
                    <Edit3 className="h-4 w-4" /> Edit
                  </button>
                  <button onClick={() => removeContact(contact._id)} className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-400">
                    <Trash2 className="h-4 w-4" /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-[32px] border border-dashed border-white/15 bg-slate-950/70 p-12 text-center text-slate-400">
            <p className="text-lg font-semibold text-white">No contacts available yet.</p>
            <p className="mt-3 text-sm">Add a trusted contact to keep your legacy network strong.</p>
          </div>
        )}
      </motion.section>
    </AuthenticatedLayout>
  );
};

export default Contacts;
