import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { MobileSidebar } from './MobileSidebar';
import { Topbar } from './Topbar';
import { useApp } from '../../context/AppContext';

export const DashboardLayout = () => {
  const { sidebarCollapsed } = useApp();

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-slate-900 flex font-sans">
      {/* Fixed Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Drawer Sidebar */}
      <MobileSidebar />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          sidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
        }`}
      >
        {/* Sticky Topbar */}
        <Topbar />

        {/* Dynamic Page Content with Reduced Side Margins for Widescreen Layout */}
        <main className="flex-1 p-3 sm:p-4 lg:p-5 max-w-[1800px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
