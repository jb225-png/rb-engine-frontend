import { useQuery } from '@tanstack/react-query';

interface Product {
  id: string;
  name: string;
  type: string;
  status: string;
  createdAt: string;
}

// Mock API function
const fetchProducts = async (): Promise<Product[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock data
  return [
    {
      id: '1',
      name: 'Math Course - Grade 3',
      type: 'Course',
      status: 'Published',
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      name: 'Reading Module - Level 1',
      type: 'Module',
      status: 'Draft',
      createdAt: '2024-01-14',
    },
  ];
};

export const useProductsQuery = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });
};