import { mockApiCall } from './apiClient';
import { initialStudents } from '../data/mockData';
import { calculateStudentRisk } from '../utils/riskCalculator';

export const studentService = {
  async getStudents() {
    return mockApiCall(() => {
      const stored = localStorage.getItem('dropout_students_data');
      return stored ? JSON.parse(stored) : initialStudents;
    });
  },

  async getStudentById(id) {
    return mockApiCall(() => {
      const stored = localStorage.getItem('dropout_students_data');
      const list = stored ? JSON.parse(stored) : initialStudents;
      return list.find(s => s.id === id) || null;
    });
  },

  async saveStudent(studentData) {
    return mockApiCall(() => {
      const stored = localStorage.getItem('dropout_students_data');
      let list = stored ? JSON.parse(stored) : [...initialStudents];
      
      const prediction = calculateStudentRisk(studentData);
      const enrichedStudent = {
        ...studentData,
        ...prediction,
        lastUpdated: new Date().toISOString().split('T')[0]
      };

      const existingIndex = list.findIndex(s => s.id === studentData.id);
      if (existingIndex >= 0) {
        list[existingIndex] = enrichedStudent;
      } else {
        list.unshift(enrichedStudent);
      }

      localStorage.setItem('dropout_students_data', JSON.stringify(list));
      return enrichedStudent;
    });
  },

  async deleteStudent(id) {
    return mockApiCall(() => {
      const stored = localStorage.getItem('dropout_students_data');
      let list = stored ? JSON.parse(stored) : [...initialStudents];
      list = list.filter(s => s.id !== id);
      localStorage.setItem('dropout_students_data', JSON.stringify(list));
      return { success: true, id };
    });
  }
};
