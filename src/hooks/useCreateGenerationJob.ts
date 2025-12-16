import { useMutation, useQueryClient } from '@tanstack/react-query';

interface GenerationJobData {
  standardCode: string;
  fullBundle: boolean;
  selectedProducts: string[];
}

interface GenerationJob {
  id: string;
  standardCode: string;
  status: 'pending' | 'generating' | 'success' | 'error';
  createdAt: string;
}

// Mock API function
const createGenerationJob = async (data: GenerationJobData): Promise<GenerationJob> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Simulate random success/error
  if (Math.random() > 0.8) {
    throw new Error('Generation failed');
  }
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    standardCode: data.standardCode,
    status: 'generating',
    createdAt: new Date().toISOString(),
  };
};

export const useCreateGenerationJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createGenerationJob,
    onSuccess: () => {
      // Invalidate and refetch generation history
      queryClient.invalidateQueries({ queryKey: ['generation-history'] });
    },
  });
};