// ELA Template types
export type TemplateType = 
  | 'BUNDLE_OVERVIEW'
  | 'VOCABULARY_PACK'
  | 'ANCHOR_READING_PASSAGE'
  | 'READING_COMPREHENSION_QUESTIONS'
  | 'SHORT_QUIZ'
  | 'EXIT_TICKETS';

export type ELAStandardType = 'RI' | 'RL';
export type GradeLevel = 6 | 7 | 8;
export type WorldviewFlag = 'CHRISTIAN' | 'NEUTRAL';
export type ProductStatus = 'DRAFT' | 'GENERATED' | 'FAILED';
export type JobStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

// Product types
export interface Product {
  id: string;
  template_type: TemplateType;
  status: ProductStatus;
  standard_id: number;
  generation_job_id?: string;
  grade_level: GradeLevel;
  ela_standard_type: ELAStandardType;
  ela_standard_code: string;
  worldview_flag: WorldviewFlag;
  is_christian_content: boolean;
  seo_title?: string;
  seo_description?: string;
  internal_linking_block?: string;
  social_snippets?: string;
  created_at: string;
}

export interface ProductDetail extends Product {
  metadata?: {
    title?: string;
    description?: string;
    tags?: string[];
    price?: number;
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
  grade_level: GradeLevel;
  ela_standard_type: ELAStandardType;
}

// Generation Job types
export interface GenerationJob {
  id: string;
  standard_id: number;
  status: JobStatus;
  grade_level: GradeLevel;
  ela_standard_type: ELAStandardType;
  ela_standard_code: string;
  worldview_flag: WorldviewFlag;
  total_products: number;
  completed_products: number;
  failed_products: number;
  created_at: string;
  updated_at?: string;
}

export interface GenerateTemplateRequest {
  standard_id: number;
  template_type: TemplateType;
  grade_level: GradeLevel;
  ela_standard_type: ELAStandardType;
  ela_standard_code: string;
  worldview_flag: WorldviewFlag;
}

export interface GenerateTemplateResponse {
  job_id: string;
  product_id: string;
  message: string;
  seo_title?: string;
  seo_description?: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    has_next: boolean;
  };
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
    COMPLETED: number;
    FAILED: number;
  };
  templates_by_type: Record<TemplateType, number>;
  content_by_worldview: {
    CHRISTIAN: number;
    NEUTRAL: number;
  };
  content_by_grade: Record<string, number>;
}

// Query parameters
export interface ProductsQueryParams {
  limit?: number;
  offset?: number;
  status?: ProductStatus;
  template_type?: TemplateType;
  generation_job_id?: string;
  standard_id?: number;
  grade_level?: GradeLevel;
  ela_standard_type?: ELAStandardType;
  worldview_flag?: WorldviewFlag;
}

export interface StandardsQueryParams {
  limit?: number;
  offset?: number;
  grade_level?: GradeLevel;
  ela_standard_type?: ELAStandardType;
}