import { useQuery } from '@tanstack/react-query';
import { standardsApi } from '../api/standards';

// Query keys
export const standardsKeys = {
  all: ['standards'] as const,
  lookup: (params: { code?: string; grade_level?: number; curriculum_board?: string }) => 
    [...standardsKeys.all, 'lookup', params] as const,
  detail: (id: number) => [...standardsKeys.all, 'detail', id] as const,
};

// Lookup standards with debounced search
export const useStandardsLookup = (params: {
  code?: string;
  grade_level?: number;
  curriculum_board?: string;
  limit?: number;
}, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: standardsKeys.lookup(params),
    queryFn: () => standardsApi.lookupStandards(params),
    enabled: options?.enabled ?? !!params.code,
    retry: false,
  });
};

// Get standard by ID
export const useStandardQuery = (id: number, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: standardsKeys.detail(id),
    queryFn: () => standardsApi.getStandard(id),
    enabled: options?.enabled ?? !!id,
    retry: false,
  });
};