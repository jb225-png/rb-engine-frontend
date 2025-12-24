import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { generationApi } from '../api/generation';
import { CreateGenerationJobRequest } from '../types/api';

// Query keys
export const generationKeys = {
  all: ['generation-jobs'] as const,
  lists: () => [...generationKeys.all, 'list'] as const,
  list: (params: { page?: number; limit?: number }) => [...generationKeys.lists(), params] as const,
  details: () => [...generationKeys.all, 'detail'] as const,
  detail: (id: string) => [...generationKeys.details(), id] as const,
};

// Get generation jobs list
export const useGenerationJobsQuery = (params: { page?: number; limit?: number } = {}) => {
  return useQuery({
    queryKey: generationKeys.list(params),
    queryFn: () => generationApi.getGenerationJobs(params),
    keepPreviousData: true,
  });
};

// Get single generation job
export const useGenerationJobQuery = (id: string) => {
  return useQuery({
    queryKey: generationKeys.detail(id),
    queryFn: () => generationApi.getGenerationJob(id),
    enabled: !!id,
  });
};

// Create generation job mutation
export const useCreateGenerationJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGenerationJobRequest) => 
      generationApi.createGenerationJob(data),
    onSuccess: () => {
      // Invalidate generation jobs list
      queryClient.invalidateQueries({ queryKey: generationKeys.lists() });
      // Invalidate products list to show any new products
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};