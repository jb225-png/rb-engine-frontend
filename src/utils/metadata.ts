// Utility functions for metadata formatting and display

export interface QCVerdict {
  verdict: 'PASS' | 'NEEDS_FIX' | 'FAIL';
  score: number;
  issues?: string[];
}

export interface ProductMetadata {
  title?: string;
  description?: string;
  tags?: string[];
  price?: number;
  currency?: string;
}

// Format product title with fallback
export const formatTitle = (title?: string, productType?: string, standardId?: number): string => {
  if (title) return title;
  if (productType && standardId) {
    return `${productType.charAt(0).toUpperCase() + productType.slice(1).toLowerCase()} - Standard ${standardId}`;
  }
  return 'Untitled Product';
};

// Format price display
export const formatPrice = (price?: number, currency: string = 'USD'): string => {
  if (typeof price !== 'number') return 'Price not set';
  
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  });
  
  return formatter.format(price);
};

// Format tags for display
export const formatTags = (tags?: string[]): string => {
  if (!tags || tags.length === 0) return 'No tags';
  return tags.join(', ');
};

// Get QC verdict color mapping
export const getQCVerdictColor = (verdict?: string): string => {
  switch (verdict) {
    case 'PASS': return 'text-success-600 bg-success-50';
    case 'NEEDS_FIX': return 'text-warning-600 bg-warning-50';
    case 'FAIL': return 'text-error-600 bg-error-50';
    default: return 'text-neutral-600 bg-neutral-50';
  }
};

// Get QC score color based on score value
export const getQCScoreColor = (score?: number): string => {
  if (typeof score !== 'number') return 'text-neutral-600';
  
  if (score >= 80) return 'text-success-600';
  if (score >= 60) return 'text-warning-600';
  return 'text-error-600';
};

// Format QC score display
export const formatQCScore = (score?: number): string => {
  if (typeof score !== 'number') return 'No score';
  return `${Math.round(score)}%`;
};

// Extract metadata from product data
export const extractMetadata = (product: any): ProductMetadata => {
  const metadata = product.metadata || {};
  
  return {
    title: metadata.title || product.name,
    description: metadata.description || product.description,
    tags: metadata.tags || [],
    price: metadata.price,
    currency: metadata.currency || 'USD',
  };
};

// Extract QC verdict from product data
export const extractQCVerdict = (product: any): QCVerdict | null => {
  const qcReport = product.qc_report;
  
  if (!qcReport) return null;
  
  return {
    verdict: qcReport.verdict || 'PASS',
    score: qcReport.score || 0,
    issues: qcReport.issues || [],
  };
};

// Copy text to clipboard
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};