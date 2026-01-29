import { apiClient } from './client';
import { Standard } from '../types/api';

export const standardsApi = {
  // Lookup standards by code with auto-complete
  lookupStandards: async (params: {
    code?: string;
    grade_level?: number;
    curriculum_board?: string;
    limit?: number;
  }): Promise<Standard[]> => {
    const response = await apiClient.get('/standards/lookup', { params });
    return response.data;
  },

  // Get standard by ID
  getStandard: async (id: number): Promise<Standard> => {
    const response = await apiClient.get(`/standards/${id}`);
    return response.data;
  },
};