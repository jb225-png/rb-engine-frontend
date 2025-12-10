import React from 'react';

export const Topbar: React.FC = () => {
  return (
    <header className="bg-white border-b border-neutral-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">
            Curriculum Management System
          </h2>
          <p className="text-sm text-neutral-500">
            AI-driven content generation and management
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-neutral-900">Admin User</p>
            <p className="text-xs text-neutral-500">admin@rbbengine.com</p>
          </div>
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-primary-600 font-semibold">AU</span>
          </div>
        </div>
      </div>
    </header>
  );
};