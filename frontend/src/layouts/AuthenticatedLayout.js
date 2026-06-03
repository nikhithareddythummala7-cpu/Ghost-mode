import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

const AuthenticatedLayout = ({ title, children }) => (
  <div className="min-h-screen bg-transparent py-6 px-4 lg:px-8">
    <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-[1400px] gap-6">
      <Sidebar />
      <div className="flex-1 space-y-6">
        <TopBar title={title} />
        <div className="glass-card p-6">{children}</div>
      </div>
    </div>
  </div>
);

export default AuthenticatedLayout;
