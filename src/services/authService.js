import { mockApiCall } from './apiClient';

export const DEMO_CREDENTIALS = {
  admin: {
    email: "admin@edurisk.ai",
    password: "Admin@123",
    name: "Dr. Ramanathan Iyer",
    role: "admin",
    designation: "Principal & Academic Dean",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
  },
  faculty: {
    email: "faculty@edurisk.ai",
    password: "Faculty@123",
    name: "Dr. Anjali Deshmukh",
    role: "faculty",
    facultyId: "FAC001",
    designation: "Associate Professor & HOD (IT)",
    avatar: "https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?w=150&auto=format&fit=crop&q=80"
  },
  student: {
    email: "student@edurisk.ai",
    password: "Student@123",
    name: "Aarav Patil",
    role: "student",
    studentId: "TYIT001",
    department: "Information Technology",
    semester: 5,
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80"
  }
};

export const authService = {
  async login(email, password, requestedRole = null) {
    return mockApiCall(() => {
      const trimmedEmail = email?.trim().toLowerCase();
      let matchedUser = null;

      // Check Admin accounts (both primary demo and alternate college/edurisk aliases)
      if (
        (trimmedEmail === "admin@edurisk.ai" || trimmedEmail === "admin@college.edu" || trimmedEmail === "admin@edurisk.edu") &&
        (password === "Admin@123" || password === "admin123" || password === "password123")
      ) {
        matchedUser = DEMO_CREDENTIALS.admin;
      }
      // Check Faculty accounts
      else if (
        (trimmedEmail === "faculty@edurisk.ai" || trimmedEmail === "faculty@college.edu" || trimmedEmail === "faculty@edurisk.edu") &&
        (password === "Faculty@123" || password === "faculty123" || password === "password123")
      ) {
        matchedUser = DEMO_CREDENTIALS.faculty;
      }
      // Check Student accounts
      else if (
        (trimmedEmail === "student@edurisk.ai" || trimmedEmail === "student@college.edu" || trimmedEmail === "student@edurisk.edu" || trimmedEmail === "aarav.patil@student.edu") &&
        (password === "Student@123" || password === "student123" || password === "password123")
      ) {
        matchedUser = DEMO_CREDENTIALS.student;
      }

      if (matchedUser) {
        // If a specific role was requested on the login page, verify it matches
        if (requestedRole && matchedUser.role !== requestedRole.toLowerCase()) {
          throw new Error(`These credentials belong to a ${matchedUser.role.toUpperCase()} account. Please sign in as ${matchedUser.role} or choose the correct persona.`);
        }

        const token = "jwt_mock_token_" + matchedUser.role + "_" + Date.now();
        localStorage.setItem('dropout_auth_user', JSON.stringify(matchedUser));
        localStorage.setItem('dropout_auth_token', token);
        return { success: true, user: matchedUser, token };
      } else {
        throw new Error("Invalid email or password. Please check your credentials or use the demo login buttons.");
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
