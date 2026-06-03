import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, Package, Flag, Mail, HardDrive, AlertTriangle, BarChart3, Settings, LogOut } from 'lucide-react';

const links = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'User Management', to: '/admin/users', icon: Users },
  { label: 'Capsules Management', to: '/admin/capsules', icon: Package },
  { label: 'Flagged Messages', to: '/admin/flagged', icon: Flag },
  { label: 'Scheduled Messages', to: '/admin/messages', icon: Mail },
  { label: 'Memory Vault Records', to: '/admin/vault', icon: HardDrive },
  { label: 'Emergency Contacts', to: '/admin/contacts', icon: AlertTriangle },
  { label: 'Analytics', to: '/admin/analytics', icon: BarChart3 },
  { label: 'Settings', to: '/admin/settings', icon: Settings }
];

const AdminSidebar = () => {
  const { logout } = useAuth();

  return (
    <aside className="hidden w-72 shrink-0 flex-col rounded-[32px] border border-white/10 bg-slate-950/80 p-5 shadow-panel backdrop-blur-xl lg:flex">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.35em] text-neon-blue">GhostMode Admin</p>
        <h2 className="mt-4 text-2xl font-semibold text-slate-100">Command Console</h2>
        <p className="mt-3 text-sm text-slate-400">Secure platform oversight</p>
      </div>
      <nav className="space-y-2">
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-3xl px-4 py-3 text-sm transition ${isActive ? 'bg-neon-violet/10 text-white shadow-glow' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`
              }
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
      <button onClick={logout} className="mt-auto flex items-center justify-center gap-2 rounded-3xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-500">
        <LogOut className="h-4 w-4" /> Logout
      </button>
    </aside>
  );
};

export default AdminSidebar;
