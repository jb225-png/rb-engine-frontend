import React from 'react';

export const Topbar: React.FC = () => {
  return (
    <header className="bg-white border-b border-neutral-200 px-4 sm:px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-neutral-900 truncate">
            Curriculum Management System
          </h2>
          <p className="text-sm text-neutral-500 hidden sm:block">
            AI-driven content generation and management
          </p>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-neutral-900">Admin User</p>
            <p className="text-xs text-neutral-500">admin@rbbengine.com</p>
          </div>
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center hover:bg-primary-200 transition-colors cursor-pointer">
            <span className="text-primary-600 font-semibold text-sm">AU</span>
          </div>
        </div>
      </div>
    </header>
  );
};