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
