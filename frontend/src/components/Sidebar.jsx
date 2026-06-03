import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Clock3, Send, HardDrive, Users, UserCircle } from 'lucide-react';

const userLinks = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Time Capsules', to: '/capsules', icon: Clock3 },
  { label: 'Scheduled Messages', to: '/messages', icon: Send },
  { label: 'Memory Vault', to: '/vault', icon: HardDrive },
  { label: 'Emergency Contacts', to: '/contacts', icon: Users },
  { label: 'Profile', to: '/profile', icon: UserCircle }
];

const adminLinks = [
  { label: 'Admin Dashboard', to: '/admin/dashboard', icon: LayoutDashboard }
];

const Sidebar = () => {
  const { user } = useAuth();

  const links = user?.role === 'admin' ? adminLinks : userLinks;
  const title = user?.role === 'admin' ? 'GhostMode Admin' : 'GhostMode';
  const subtitle = user?.role === 'admin' ? 'Platform management center' : 'Digital legacy command';

  return (
    <aside className="hidden h-screen w-72 shrink-0 flex-col rounded-[32px] border border-white/10 bg-slate-950/80 p-5 shadow-panel backdrop-blur-xl lg:flex">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.35em] text-neon-blue">{title}</p>
        <h2 className="mt-4 text-2xl font-semibold text-slate-100">{user?.role === 'admin' ? 'Control Room' : 'Legacy Hub'}</h2>
        <p className="mt-3 text-sm text-slate-400">{subtitle}</p>
      </div>
      <nav className="space-y-2">
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-3xl px-4 py-3 text-sm transition ${isActive ? 'bg-neon-blue/10 text-white shadow-glow' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`
              }
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
