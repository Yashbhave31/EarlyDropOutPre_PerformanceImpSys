import { mockApiCall } from './apiClient';
import { initialInterventions } from '../data/mockData';

export const interventionService = {
  async getInterventions() {
    return mockApiCall(() => {
      const stored = localStorage.getItem('dropout_interventions_data');
      return stored ? JSON.parse(stored) : initialInterventions;
    });
  },

  async createIntervention(interventionData) {
    return mockApiCall(() => {
      const stored = localStorage.getItem('dropout_interventions_data');
      let list = stored ? JSON.parse(stored) : [...initialInterventions];
      const newRecord = {
        id: "INT-2026-" + String(list.length + 1).padStart(3, '0'),
        date: new Date().toISOString().split('T')[0],
        status: "Planned",
        ...interventionData
      };
      list.unshift(newRecord);
      localStorage.setItem('dropout_interventions_data', JSON.stringify(list));
      return newRecord;
    });
  },

  async updateIntervention(id, updates) {
    return mockApiCall(() => {
      const stored = localStorage.getItem('dropout_interventions_data');
      let list = stored ? JSON.parse(stored) : [...initialInterventions];
      const idx = list.findIndex(item => item.id === id);
      if (idx >= 0) {
        list[idx] = { ...list[idx], ...updates };
        localStorage.setItem('dropout_interventions_data', JSON.stringify(list));
        return list[idx];
      }
      throw new Error("Intervention not found");
    });
  }
};
