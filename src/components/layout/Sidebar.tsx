import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Dashboard', icon: '📊' },
  { path: '/products', label: 'Products', icon: '📦' },
  { path: '/quick-generate', label: 'Quick Generate', icon: '⚡' },
  { path: '/jobs', label: 'Generation Jobs', icon: '🔄' },
  { path: '/upload-queue', label: 'Upload Queue', icon: '📤' },
  { path: '/bundles', label: 'Bundles', icon: '📚' },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white border-r border-neutral-200 h-screen sticky top-0 hidden lg:block">
      <div className="p-6 border-b border-neutral-100">
        <h1 className="text-2xl font-bold text-primary-600">RBB Engine</h1>
        <p className="text-xs text-neutral-500 mt-1">Admin Portal</p>
      </div>

      <nav className="p-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg mb-1
                transition-all duration-200 group
                ${isActive 
                  ? 'bg-primary-50 text-primary-700 font-medium shadow-sm border border-primary-100' 
                  : 'text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900'
                }
              `}
            >
              <span className="text-lg group-hover:scale-110 transition-transform">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
