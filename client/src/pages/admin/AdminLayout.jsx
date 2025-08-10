import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, FileText, BarChart2, Settings, Home } from 'lucide-react';

const navLinks = [
  { to: '/admin', label: 'Dashboard', icon: <Home size={18} /> },
  { to: '/admin/users', label: 'Users', icon: <Users size={18} /> },
  { to: '/admin/stories', label: 'Stories', icon: <FileText size={18} /> },
  { to: '/admin/analytics', label: 'Analytics', icon: <BarChart2 size={18} /> },
  { to: '/admin/settings', label: 'Settings', icon: <Settings size={18} /> },
];

const AdminLayout = ({ children }) => {
  const location = useLocation();
  return (
    <div className='flex min-h-screen bg-ajira-lightGray'>
      {/* Sidebar */}
      <aside className='w-64 bg-white shadow-lg flex flex-col'>
        <div className='h-20 flex items-center justify-center border-b'>
          <img
            src='/logo.jpeg'
            alt='Admin Logo'
            className='h-12 w-auto rounded-lg'
          />
        </div>
        <nav className='flex-1 py-6 px-4 space-y-2'>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center space-x-3 px-4 py-2 rounded-lg font-medium transition-colors ${
                location.pathname === link.to
                  ? 'bg-ajira-primary text-white'
                  : 'text-ajira-blue hover:bg-ajira-primary/10'
              }`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>
      </aside>
      {/* Main Content */}
      <div className='flex-1 flex flex-col'>
        {/* Header */}
        <header className='h-20 bg-white shadow flex items-center px-8 border-b'>
          <h1 className='text-2xl font-bold text-ajira-blue'>Admin Panel</h1>
        </header>
        <main className='flex-1 p-8 overflow-y-auto'>{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
