// Product types
export interface Product {
  id: string;
  name: string;
  type: 'course' | 'module' | 'lesson' | 'assessment' | 'activity' | 'resource';
  status: 'draft' | 'review' | 'published' | 'archived';
  standardCode?: string;
  grade?: string;
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

// Query parameters
export interface ProductsQueryParams {
  page?: number;
  limit?: number;
  status?: Product['status'];
  type?: Product['type'];
  search?: string;
}