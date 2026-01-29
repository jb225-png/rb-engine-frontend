// Product types
export interface Product {
  id: string;
  name: string;
  product_type: 'WORKSHEET' | 'PASSAGE' | 'QUIZ' | 'ASSESSMENT' | 'FLASHCARDS' | 'LESSON_PLAN' | 'RUBRIC' | 'PROJECT' | 'PRESENTATION' | 'ACTIVITY' | 'GAME' | 'SIMULATION';
  status: 'DRAFT' | 'GENERATED' | 'FAILED';
  standard_id?: number;
  generation_job_id?: string;
  grade_level?: number;
  curriculum_board?: string;
  locale?: string;
  created_at: string;
  updated_at: string;
}

export interface ProductDetail extends Product {
  description?: string;
  metadata?: {
    title?: string;
    description?: string;
    tags?: string[];
    price?: number;
    currency?: string;
    [key: string]: any;
  };
  raw_json?: Record<string, any>;
  final_json?: Record<string, any>;
  qc_report?: {
    verdict?: 'PASS' | 'NEEDS_FIX' | 'FAIL';
    score?: number;
    issues?: string[];
    [key: string]: any;
  };
  files?: string[];
}

// Standard types
export interface Standard {
  id: number;
  code: string;
  description?: string;
  grade_level?: number;
  curriculum_board?: string;
  locale?: string;
}

// Generation Job types
export interface GenerationJob {
  id: string;
  standard_id: number;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  total_products?: number;
  completed_products?: number;
  failed_products?: number;
  created_at: string;
  updated_at?: string;
}

export interface CreateGenerationJobRequest {
  standard_id: number;
  product_type?: Product['product_type'];
  locale?: string;
  curriculum_board?: string;
  grade_level?: number;
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
  product_id?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  assigned_to?: string;
  created_at: string;
  updated_at: string;
}

// Dashboard metrics
export interface DashboardStats {
  total_products: number;
  products_by_status: {
    DRAFT: number;
    GENERATED: number;
    FAILED: number;
  };
  total_generation_jobs: number;
  jobs_by_status: {
    PENDING: number;
    RUNNING: number;
    COMPLETED: number;
    FAILED: number;
  };
  total_upload_tasks: number;
  tasks_by_status: {
    PENDING: number;
    IN_PROGRESS: number;
    COMPLETED: number;
  };
}

// Query parameters
export interface ProductsQueryParams {
  page?: number;
  limit?: number;
  status?: Product['status'];
  product_type?: Product['product_type'];
  search?: string;
  generation_job_id?: string;
  standard_id?: number;
  curriculum_board?: string;
  grade_level?: number;
  locale?: string;
  offset?: number;
}

export interface UploadTasksQueryParams {
  page?: number;
  limit?: number;
  status?: UploadTask['status'];
}