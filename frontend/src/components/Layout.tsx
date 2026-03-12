import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Users, MessageSquare, Settings, LogOut, ShieldCheck, Package } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: ShoppingCart, label: 'Orders', path: '/orders' },
    { icon: Users, label: 'Customers', path: '/customers' },
    { icon: Package, label: 'Catalog', path: '/products' },
    { icon: MessageSquare, label: 'Messages', path: '/messages' },
    ...(user?.role === 'ADMIN' ? [{ icon: Users, label: 'Team', path: '/users' }] : []),
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col min-h-screen">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-lg">T</span>
          </div>
          Tracker Pro
        </h1>
      </div>
      
      <div className="p-6 bg-slate-800/50 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center font-bold">
          {user?.name.charAt(0)}
        </div>
        <div className="overflow-hidden">
          <p className="font-bold text-sm truncate">{user?.name}</p>
          <div className="flex items-center gap-1">
            <ShieldCheck size={12} className="text-primary-500" />
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{user?.role}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 flex flex-col gap-1 mt-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
              ${isActive 
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/50' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'}
            `}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 flex flex-col gap-1">
        <NavLink 
          to="/settings"
          className={({ isActive }) => `
            flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
            ${isActive 
              ? 'bg-slate-800 text-white shadow-lg' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800'}
          `}
        >
          <Settings size={20} />
          <span className="font-medium">Settings</span>
        </NavLink>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-red-400 hover:text-red-300 hover:bg-red-500/10"
        >
          <LogOut size={20} />
          <span className="font-medium">Log Out</span>
        </button>
      </div>
    </div>
  );
};

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
