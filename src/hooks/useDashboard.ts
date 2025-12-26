import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboard';

export const useDashboardMetrics = () => {
  return useQuery({
    queryKey: ['dashboard', 'metrics'],
    queryFn: dashboardApi.getMetrics,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useRecentProducts = (limit: number = 5) => {
  return useQuery({
    queryKey: ['dashboard', 'recent-products', limit],
    queryFn: () => dashboardApi.getRecentProducts(limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useRecentJobs = (limit: number = 5) => {
  return useQuery({
    queryKey: ['dashboard', 'recent-jobs', limit],
    queryFn: () => dashboardApi.getRecentJobs(limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};