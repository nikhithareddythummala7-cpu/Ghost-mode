import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

const AuthenticatedLayout = ({ title, children }) => (
  <div className="h-screen overflow-hidden bg-transparent">
    <div className="mx-auto flex h-full max-w-[1400px] gap-6 px-4 lg:px-8">
      <Sidebar />
      <main className="flex-1 flex min-h-0 flex-col overflow-hidden">
        <TopBar title={title} />
        <div className="glass-card flex-1 overflow-hidden p-6">
          <div className="h-full min-h-0 overflow-y-auto pr-2">{children}</div>
        </div>
      </main>
    </div>
  </div>
);

export default AuthenticatedLayout;
