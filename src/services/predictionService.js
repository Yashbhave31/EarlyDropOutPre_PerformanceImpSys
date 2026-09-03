import { mockApiCall } from './apiClient';
import { calculateStudentRisk } from '../utils/riskCalculator';

export const predictionService = {
  async runPrediction(studentData) {
    return mockApiCall(() => {
      const result = calculateStudentRisk(studentData);
      return {
        success: true,
        model: "RandomForest_Ensemble_Classifier (Scikit-learn 1.4)",
        timestamp: new Date().toISOString(),
        ...result
      };
    });
  }
};
