import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { MobileSidebar } from './MobileSidebar';
import { Topbar } from './Topbar';
import { useApp } from '../../context/AppContext';

export const DashboardLayout = () => {
  const { sidebarCollapsed, toggleSidebarCollapse } = useApp();
  const location = useLocation();
  const mainRef = useRef(null);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleSidebarCollapse();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebarCollapse]);

  return (
    <div className="h-screen overflow-hidden bg-slate-50 text-slate-900 flex font-sans">
      {/* Fixed Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Drawer Sidebar */}
      <MobileSidebar />

      {/* Main Content Area Wrapper */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out md:pt-2 md:pl-2 ${
          sidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
        }`}
      >
        {/* Floating White App Canvas */}
        <div className="flex-1 flex flex-col bg-white md:rounded-tl-[1.5rem] md:border-t md:border-l border-slate-200/60 shadow-sm overflow-hidden h-full relative">
          
          {/* Topbar stays at top of canvas */}
          <div className="shrink-0">
            <Topbar />
          </div>

          {/* Scrollable Main Content */}
          <main ref={mainRef} className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-5">
            <div className="max-w-[1800px] w-full mx-auto">
              <Outlet />
            </div>
          </main>

        </div>
      </div>
    </div>
  );
};
