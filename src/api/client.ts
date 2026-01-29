import axios from 'axios';

// API base URL from environment variables
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Create Axios instance with default configuration
export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data?.detail || error.message);
    return Promise.reject(error);
  }
);

// API Types
export interface GenerateProductRequest {
  standard_id: number;
  product_type: 'WORKSHEET' | 'QUIZ' | 'PASSAGE' | 'ASSESSMENT';
  locale?: 'IN' | 'US';
  curriculum_board?: 'CBSE' | 'COMMON_CORE';
  grade_level: number;
}

export interface GenerateProductResponse {
  job_id: number;
  product_ids: number[];
  message: string;
}

export interface Product {
  id: number;
  standard_id: number;
  generation_job_id: number;
  product_type: string;
  status: 'DRAFT' | 'GENERATED' | 'FAILED';
  locale: string;
  curriculum_board: string;
  grade_level: number;
  created_at: string;
}

export interface GenerationJob {
  id: number;
  standard_id: number;
  locale: string;
  curriculum_board: string;
  grade_level: number;
  job_type: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  total_products: number;
  completed_products: number;
  failed_products: number;
  created_at: string;
  updated_at: string;
}

// API Functions
export const api = {
  // Generate product
  generateProduct: async (data: GenerateProductRequest): Promise<GenerateProductResponse> => {
    const response = await apiClient.post('/generate-product', data);
    return response.data;
  },

  // Get products
  getProducts: async (params?: {
    status?: string;
    product_type?: string;
    curriculum_board?: string;
    grade_level?: number;
    limit?: number;
    offset?: number;
  }) => {
    const response = await apiClient.get('/products', { params });
    return response.data;
  },

  // Get specific product
  getProduct: async (id: number) => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  // Get product content
  getProductContent: async (id: number) => {
    const response = await apiClient.get(`/products/${id}/content`);
    return response.data;
  },

  // Get generation jobs
  getGenerationJobs: async (params?: {
    status?: string;
    limit?: number;
    offset?: number;
  }) => {
    const response = await apiClient.get('/v1/generation-jobs', { params });
    return response.data;
  },

  // Get specific job
  getGenerationJob: async (id: number) => {
    const response = await apiClient.get(`/v1/generation-jobs/${id}`);
    return response.data;
  },

  // Health check
  healthCheck: async () => {
    const response = await apiClient.get('/health');
    return response.data;
  }
};