import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import TopBar from '../components/TopBar';

const AdminLayout = () => (
  <div className="h-screen overflow-hidden bg-transparent">
    <div className="mx-auto flex h-full max-w-[1600px] gap-6 px-4 lg:px-8">
      <AdminSidebar />
      <main className="flex-1 flex min-h-0 flex-col overflow-hidden">
        <TopBar title="Admin Console" />
        <div className="glass-card flex-1 overflow-hidden p-6">
          <div className="h-full min-h-0 overflow-y-auto pr-2">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  </div>
);

export default AdminLayout;
