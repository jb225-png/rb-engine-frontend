import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Dashboard', icon: '📊' },
  { path: '/products', label: 'Products', icon: '📦' },
  { path: '/quick-generate', label: 'Quick Generate', icon: '⚡' },
  { path: '/upload-queue', label: 'Upload Queue', icon: '📤' },
  { path: '/bundles', label: 'Bundles', icon: '📚' },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white border-r border-neutral-200 h-screen sticky top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary-600">RBB Engine</h1>
        <p className="text-xs text-neutral-500 mt-1">Admin Portal</p>
      </div>

      <nav className="px-3">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg mb-1
                transition-colors duration-200
                ${isActive 
                  ? 'bg-primary-50 text-primary-700 font-medium' 
                  : 'text-neutral-700 hover:bg-neutral-50'
                }
              `}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
