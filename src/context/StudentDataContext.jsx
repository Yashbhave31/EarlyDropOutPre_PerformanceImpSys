import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialStudents, initialInterventions, facultyMembers, departmentStats } from '../data/mockData';
import { studentService } from '../services/studentService';
import { interventionService } from '../services/interventionService';
import { calculateStudentRisk } from '../utils/riskCalculator';

const StudentDataContext = createContext();

export function StudentDataProvider({ children }) {
  const [students, setStudents] = useState(initialStudents);
  const [interventions, setInterventions] = useState(initialInterventions);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [studentList, interventionList] = await Promise.all([
          studentService.getStudents(),
          interventionService.getInterventions()
        ]);
        if (studentList && studentList.length > 0) setStudents(studentList);
        if (interventionList && interventionList.length > 0) setInterventions(interventionList);
      } catch (err) {
        console.error("Failed to load students/interventions", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const refreshStudents = async () => {
    const list = await studentService.getStudents();
    setStudents(list);
  };

  const refreshInterventions = async () => {
    const list = await interventionService.getInterventions();
    setInterventions(list);
  };

  const saveStudent = async (studentData) => {
    const saved = await studentService.saveStudent(studentData);
    await refreshStudents();
    return saved;
  };

  const updateStudent = async (studentData) => {
    return saveStudent(studentData);
  };

  const addStudent = async (studentData) => {
    return saveStudent(studentData);
  };

  const saveIntervention = async (interventionData) => {
    let saved;
    if (interventionData.id) {
      saved = await interventionService.updateIntervention(interventionData.id, interventionData);
    } else {
      saved = await interventionService.createIntervention(interventionData);
    }
    await refreshInterventions();
    return saved;
  };

  const logIntervention = async (interventionData) => {
    return saveIntervention(interventionData);
  };

  const updateInterventionStatus = async (id, status) => {
    const updated = await interventionService.updateIntervention(id, { status });
    await refreshInterventions();
    return updated;
  };

  const runPrediction = async (studentId) => {
    const target = students.find(s => s.id === studentId);
    if (!target) return null;
    const mlResult = calculateStudentRisk(target);
    const updated = {
      ...target,
      dropoutProbability: mlResult.dropoutProbability,
      riskLevel: mlResult.riskLevel,
      contributingFactors: mlResult.contributingFactors,
      recommendations: mlResult.recommendations,
      predictionDate: mlResult.predictionDate
    };
    await saveStudent(updated);
    return updated;
  };

  const deleteStudent = async (id) => {
    await studentService.deleteStudent(id);
    await refreshStudents();
  };

  const calculateStats = () => {
    const total = students.length || 1;
    const low = students.filter(s => s.riskLevel === 'LOW').length;
    const moderate = students.filter(s => s.riskLevel === 'MODERATE' || s.riskLevel === 'MEDIUM').length;
    const high = students.filter(s => s.riskLevel === 'HIGH').length;
    const critical = students.filter(s => s.riskLevel === 'CRITICAL').length;
    const avgAtt = Math.round(students.reduce((acc, s) => acc + (s.attendance || 0), 0) / total);
    const avgCgpa = (students.reduce((acc, s) => acc + (Number(s.cgpa) || 0), 0) / total).toFixed(2);
    const avgRisk = Math.round(students.reduce((acc, s) => acc + (Number(s.dropoutProbability) || 0), 0) / total);

    return {
      totalStudents: students.length,
      lowRisk: low,
      lowRiskPercent: Math.round((low / total) * 100),
      moderateRisk: moderate,
      mediumRisk: moderate,
      moderateRiskPercent: Math.round((moderate / total) * 100),
      highRisk: high,
      highRiskPercent: Math.round((high / total) * 100),
      criticalRisk: critical,
      criticalRiskPercent: Math.round((critical / total) * 100),
      combinedHighCritical: high + critical,
      combinedHighCriticalPercent: Math.round(((high + critical) / total) * 100),
      retentionRate: 91.8,
      avgAttendance: avgAtt,
      avgCgpa: avgCgpa,
      avgRiskScore: avgRisk,
      totalFaculty: facultyMembers.length,
      feePendingCount: students.filter(s => s.feePending).length,
      activeInterventionsCount: interventions.filter(i => i.status !== 'Completed').length
    };
  };

  const stats = calculateStats();

  return (
    <StudentDataContext.Provider value={{
      students,
      interventions,
      stats,
      calculateStats,
      facultyMembers,
      faculty: facultyMembers,
      departmentStats,
      departments: departmentStats,
      loading,
      refreshStudents,
      refreshInterventions,
      saveStudent,
      updateStudent,
      addStudent,
      saveIntervention,
      logIntervention,
      updateInterventionStatus,
      runPrediction,
      deleteStudent
    }}>
      {children}
    </StudentDataContext.Provider>
  );
}

export function useStudentData() {
  const context = useContext(StudentDataContext);
  if (!context) throw new Error("useStudentData must be used within StudentDataProvider");
  return context;
}
