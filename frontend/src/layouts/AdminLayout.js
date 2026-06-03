import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import TopBar from '../components/TopBar';

const AdminLayout = () => (
  <div className="min-h-screen bg-transparent py-6 px-4 lg:px-8">
    <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-[1600px] gap-6">
      <AdminSidebar />
      <div className="flex-1 space-y-6">
        <TopBar title="Admin Console" />
        <div className="glass-card p-6">
          <Outlet />
        </div>
      </div>
    </div>
  </div>
);

export default AdminLayout;
