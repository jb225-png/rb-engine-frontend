// Product types
export interface Product {
  id: string;
  name: string;
  type: 'course' | 'module' | 'lesson' | 'assessment' | 'activity' | 'resource';
  status: 'draft' | 'review' | 'published' | 'archived';
  standardCode?: string;
  grade?: string;
  jobId?: string; // Related generation job ID
  createdAt: string;
  updatedAt: string;
}

export interface ProductDetail extends Product {
  description?: string;
  metadata?: Record<string, any>;
  rawJson?: Record<string, any>;
  finalJson?: Record<string, any>;
  qcReport?: Record<string, any>;
  files?: string[];
}

// Generation Job types
export interface GenerationJob {
  id: string;
  standardCode: string;
  status: 'pending' | 'generating' | 'success' | 'error';
  productsCount?: number;
  createdAt: string;
  completedAt?: string;
  errorMessage?: string;
}

export interface CreateGenerationJobRequest {
  standardCode: string;
  productType?: Product['type'];
  description?: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Upload Task types
export interface UploadTask {
  id: string;
  productId?: string;
  productName?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  assignedUser?: string;
  createdAt: string;
  updatedAt: string;
}

// Dashboard metrics
export interface DashboardMetrics {
  totalProducts: number;
  totalGenerationJobs: number;
  productsByStatus: {
    draft: number;
    review: number;
    published: number;
    archived: number;
  };
}

// Query parameters
export interface ProductsQueryParams {
  page?: number;
  limit?: number;
  status?: Product['status'];
  type?: Product['type'];
  search?: string;
}

export interface UploadTasksQueryParams {
  page?: number;
  limit?: number;
  status?: UploadTask['status'];
}