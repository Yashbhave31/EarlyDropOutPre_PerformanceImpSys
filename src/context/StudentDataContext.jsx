import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialStudents, facultyMembers, departmentStats } from '../data/mockData';
import { studentService } from '../services/studentService';

const StudentDataContext = createContext();

export function StudentDataProvider({ children }) {
  const [students, setStudents] = useState(initialStudents);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const list = await studentService.getStudents();
        setStudents(list);
      } catch (err) {
        console.error("Failed to load students", err);
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

  const saveStudent = async (studentData) => {
    const saved = await studentService.saveStudent(studentData);
    await refreshStudents();
    return saved;
  };

  const deleteStudent = async (id) => {
    await studentService.deleteStudent(id);
    await refreshStudents();
  };

  const stats = {
    totalStudents: students.length,
    lowRisk: students.filter(s => s.riskLevel === 'LOW').length,
    mediumRisk: students.filter(s => s.riskLevel === 'MEDIUM').length,
    highRisk: students.filter(s => s.riskLevel === 'HIGH').length,
    avgAttendance: students.length ? Math.round(students.reduce((acc, s) => acc + (s.attendance || 0), 0) / students.length) : 0,
    feePendingCount: students.filter(s => s.feePending).length
  };

  return (
    <StudentDataContext.Provider value={{ students, stats, facultyMembers, departmentStats, loading, refreshStudents, saveStudent, deleteStudent }}>
      {children}
    </StudentDataContext.Provider>
  );
}

export function useStudentData() {
  const context = useContext(StudentDataContext);
  if (!context) throw new Error("useStudentData must be used within StudentDataProvider");
  return context;
}
