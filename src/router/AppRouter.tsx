import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { Dashboard } from '../pages/Dashboard';
import { Products } from '../pages/Products';
import { ProductDetail } from '../pages/ProductDetail';
import { QuickGenerate } from '../pages/QuickGenerate';
import { UploadQueue } from '../pages/UploadQueue';
import { Bundles } from '../pages/Bundles';

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/quick-generate" element={<QuickGenerate />} />
          <Route path="/upload-queue" element={<UploadQueue />} />
          <Route path="/bundles" element={<Bundles />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
};
