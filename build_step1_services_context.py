import os

def write_file(rel_path, content):
    full = os.path.join(os.getcwd(), rel_path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")
    print("Created " + rel_path)

# 1. apiClient.js
write_file("src/services/apiClient.js", """
const SIMULATED_LATENCY_MS = 200;

export async function mockApiCall(dataSupplier) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(dataSupplier());
    }, SIMULATED_LATENCY_MS);
  });
}

export const API_CONFIG = {
  isMockMode: true,
  baseURL: "http://localhost:8080/api/v1",
  version: "1.0.0-TYIT-SYNOP"
};
""")

# 2. authService.js
write_file("src/services/authService.js", """
import { mockApiCall } from './apiClient';

export const DEMO_CREDENTIALS = {
  admin: {
    email: "admin@college.edu",
    password: "admin123",
    name: "Dr. Ramanathan Iyer",
    role: "admin",
    designation: "Principal & Academic Dean",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
  },
  faculty: {
    email: "faculty@college.edu",
    password: "faculty123",
    name: "Dr. Anjali Deshmukh",
    role: "faculty",
    facultyId: "FAC001",
    designation: "Associate Professor & HOD (IT)",
    avatar: "https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?w=150&auto=format&fit=crop&q=80"
  },
  student: {
    email: "aarav.patil@student.edu",
    password: "student123",
    name: "Aarav Patil",
    role: "student",
    studentId: "TYIT001",
    department: "Information Technology",
    semester: 5,
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80"
  }
};

export const authService = {
  async login(email, password) {
    return mockApiCall(() => {
      const trimmedEmail = email?.trim().toLowerCase();
      let matchedUser = null;

      if (trimmedEmail === DEMO_CREDENTIALS.admin.email.toLowerCase() && password === DEMO_CREDENTIALS.admin.password) {
        matchedUser = DEMO_CREDENTIALS.admin;
      } else if (trimmedEmail === DEMO_CREDENTIALS.faculty.email.toLowerCase() && password === DEMO_CREDENTIALS.faculty.password) {
        matchedUser = DEMO_CREDENTIALS.faculty;
      } else if (trimmedEmail === DEMO_CREDENTIALS.student.email.toLowerCase() && password === DEMO_CREDENTIALS.student.password) {
        matchedUser = DEMO_CREDENTIALS.student;
      }

      if (matchedUser) {
        const token = "jwt_mock_token_" + matchedUser.role + "_" + Date.now();
        localStorage.setItem('dropout_auth_user', JSON.stringify(matchedUser));
        localStorage.setItem('dropout_auth_token', token);
        return { success: true, user: matchedUser, token };
      } else {
        throw new Error("Invalid email or password. Please use demo credentials.");
      }
    });
  },

  async quickDemoLogin(role) {
    return mockApiCall(() => {
      const user = DEMO_CREDENTIALS[role] || DEMO_CREDENTIALS.admin;
      const token = "jwt_mock_token_" + user.role + "_" + Date.now();
      localStorage.setItem('dropout_auth_user', JSON.stringify(user));
      localStorage.setItem('dropout_auth_token', token);
      return { success: true, user, token };
    });
  },

  getCurrentUser() {
    try {
      const saved = localStorage.getItem('dropout_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  },

  logout() {
    localStorage.removeItem('dropout_auth_user');
    localStorage.removeItem('dropout_auth_token');
  }
};
""")

# 3. studentService.js
write_file("src/services/studentService.js", """
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
""")

# 4. predictionService.js
write_file("src/services/predictionService.js", """
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
""")

# 5. interventionService.js
write_file("src/services/interventionService.js", """
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
""")

# 6. notificationService.js
write_file("src/services/notificationService.js", """
import { mockApiCall } from './apiClient';
import { initialNotifications } from '../data/mockData';

export const notificationService = {
  async getNotifications() {
    return mockApiCall(() => {
      const stored = localStorage.getItem('dropout_notifs_data');
      return stored ? JSON.parse(stored) : initialNotifications;
    });
  },

  async markAsRead(id) {
    return mockApiCall(() => {
      const stored = localStorage.getItem('dropout_notifs_data');
      let list = stored ? JSON.parse(stored) : [...initialNotifications];
      list = list.map(n => n.id === id ? { ...n, read: true } : n);
      localStorage.setItem('dropout_notifs_data', JSON.stringify(list));
      return list;
    });
  },

  async markAllAsRead() {
    return mockApiCall(() => {
      const stored = localStorage.getItem('dropout_notifs_data');
      let list = stored ? JSON.parse(stored) : [...initialNotifications];
      list = list.map(n => ({ ...n, read: true }));
      localStorage.setItem('dropout_notifs_data', JSON.stringify(list));
      return list;
    });
  }
};
""")

# 7. Contexts
write_file("src/context/AuthContext.jsx", """
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, DEMO_CREDENTIALS } from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const existing = authService.getCurrentUser();
    if (existing) {
      setUser(existing);
    } else {
      setUser(DEMO_CREDENTIALS.admin);
      localStorage.setItem('dropout_auth_user', JSON.stringify(DEMO_CREDENTIALS.admin));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    setUser(res.user);
    return res;
  };

  const quickDemoLogin = async (role) => {
    const res = await authService.quickDemoLogin(role);
    setUser(res.user);
    return res;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, role: user?.role, isAuthenticated: !!user, loading, login, quickDemoLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
""")

write_file("src/context/ThemeContext.jsx", """
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('dropout_theme') || 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem('dropout_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark: theme === 'dark', toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
}
""")

write_file("src/context/StudentDataContext.jsx", """
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
""")

write_file("src/context/NotificationContext.jsx", """
import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialNotifications } from '../data/mockData';
import { notificationService } from '../services/notificationService';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(initialNotifications);

  useEffect(() => {
    const load = async () => {
      const list = await notificationService.getNotifications();
      setNotifications(list);
    };
    load();
  }, []);

  const markAsRead = async (id) => {
    const updated = await notificationService.markAsRead(id);
    setNotifications(updated);
  };

  const markAllAsRead = async () => {
    const updated = await notificationService.markAllAsRead();
    setNotifications(updated);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotifications must be used within NotificationProvider");
  return context;
}
""")
