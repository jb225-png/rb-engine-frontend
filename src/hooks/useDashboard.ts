import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboard';

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: dashboardApi.getStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
};

export const useRecentProducts = (limit: number = 5) => {
  return useQuery({
    queryKey: ['dashboard', 'recent-products', limit],
    queryFn: () => dashboardApi.getRecentProducts(limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: false,
  });
};

export const useRecentJobs = (limit: number = 5) => {
  return useQuery({
    queryKey: ['dashboard', 'recent-jobs', limit],
    queryFn: () => dashboardApi.getRecentJobs(limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: false,
  });
};