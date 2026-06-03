import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

const TopBar = ({ title }) => {
  const { user, logout } = useAuth();

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 rounded-[32px] border border-white/10 bg-slate-950/80 px-5 py-4 shadow-panel backdrop-blur-xl">
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-neon-blue">{title}</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Welcome back, {user?.name?.split(' ')[0] || 'Ghost'}</h1>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={logout}
          className="inline-flex items-center gap-2 rounded-3xl bg-neon-violet px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-violet-500"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </header>
  );
};

export default TopBar;
