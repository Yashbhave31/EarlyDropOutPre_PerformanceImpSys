// Mock Data for Early Dropout Prediction System
// Comprehensive dataset for TYIT Academic Year

export const initialStudents = [
  {
    id: "TYIT001",
    name: "Aarav Patil",
    email: "aarv.patil@student.edu",
    phone: "+91 98201 23456",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    dob: "2003-05-14",
    gender: "Male",
    department: "Information Technology",
    semester: 5,
    academicYear: "2025-2026",
    mentorId: "FAC001",
    mentorName: "Dr. Anjali Deshmukh",
    
    // Academic Metrics
    attendance: 68,
    internalMarks: 61,
    unitTestMarks: 58,
    assignmentScore: 72,
    practicalScore: 74,
    backlogs: 1,
    cgpa: 6.4,
    
    // Socioeconomic & Personal
    feePending: true,
    feeDueAmount: 28500,
    familyIncome: 250000,
    familyIncomeBracket: "1L - 3L",
    parentsEducation: "High School",
    familyResponsibilities: "Part-time job (15 hrs/wk)",
    distanceKm: 18,
    transportMode: "Local Train",
    extracurricular: "Low",
    
    // Prior Performance
    tenthPercent: 78.4,
    twelfthPercent: 72.1,
    
    // ML Prediction
    dropoutProbability: 46,
    riskLevel: "MEDIUM",
    predictionDate: "2026-08-28",
    lastUpdated: "2026-09-01",
    
    // Contributing Factors (SHAP Weights)
    contributingFactors: [
      { factor: "Attendance Below 70%", impact: "HIGH", weight: 0.32, type: "negative", description: "Current attendance is 68%, increasing risk significantly." },
      { factor: "1 Active Backlog (Database Management)", impact: "HIGH", weight: 0.28, type: "negative", description: "Active backlog in previous semester core subject." },
      { factor: "Tuition Fee Dues Pending", impact: "MEDIUM", weight: 0.18, type: "negative", description: "Pending balance causing financial stress." },
      { factor: "Commute Distance (18 km)", impact: "LOW", weight: 0.12, type: "negative", description: "High daily travel time reduces study hours." },
      { factor: "Consistent Practical Attendance", impact: "LOW", weight: -0.15, type: "positive", description: "Practical laboratory engagement is steady at 74%." }
    ],
    
    // Subject wise performance
    subjects: [
      { code: "IT501", name: "Software Engineering", internal: 62, unitTest: 60, practical: 75, attendance: 70, status: "Passing" },
      { code: "IT502", name: "Advanced Java Programming", internal: 55, unitTest: 52, practical: 72, attendance: 65, status: "Warning" },
      { code: "IT503", name: "Computer Networks & Security", internal: 64, unitTest: 62, practical: 76, attendance: 72, status: "Passing" },
      { code: "IT504", name: "Enterprise Java Lab", internal: 68, unitTest: 64, practical: 78, attendance: 68, status: "Passing" },
      { code: "IT505", name: "Database Systems (Backlog)", internal: 48, unitTest: 45, practical: 62, attendance: 60, status: "Critical" }
    ]
  },
  {
    id: "TYIT002",
    name: "Sneha Kulkarni",
    email: "sneha.k@student.edu",
    phone: "+91 98202 34567",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    dob: "2003-09-22",
    gender: "Female",
    department: "Information Technology",
    semester: 5,
    academicYear: "2025-2026",
    mentorId: "FAC001",
    mentorName: "Dr. Anjali Deshmukh",
    
    attendance: 92,
    internalMarks: 88,
    unitTestMarks: 85,
    assignmentScore: 94,
    practicalScore: 90,
    backlogs: 0,
    cgpa: 8.9,
    
    feePending: false,
    feeDueAmount: 0,
    familyIncome: 750000,
    familyIncomeBracket: "> 6L",
    parentsEducation: "Postgraduate",
    familyResponsibilities: "None",
    distanceKm: 5,
    transportMode: "College Bus",
    extracurricular: "High",
    
    tenthPercent: 91.2,
    twelfthPercent: 88.6,
    
    dropoutProbability: 8,
    riskLevel: "LOW",
    predictionDate: "2026-08-28",
    lastUpdated: "2026-09-02",
    
    contributingFactors: [
      { factor: "High Attendance (92%)", impact: "HIGH", weight: -0.38, type: "positive", description: "Excellent classroom attendance and consistency." },
      { factor: "Zero Backlogs & High CGPA (8.9)", impact: "HIGH", weight: -0.35, type: "positive", description: "Strong fundamental mastery across semesters." },
      { factor: "High Assignment Completion (94%)", impact: "MEDIUM", weight: -0.22, type: "positive", description: "Punctual submission of all laboratory coursework." },
      { factor: "Active Technical Club Participant", impact: "LOW", weight: -0.12, type: "positive", description: "High campus engagement and peer collaboration." }
    ],
    
    subjects: [
      { code: "IT501", name: "Software Engineering", internal: 88, unitTest: 86, practical: 92, attendance: 94, status: "Excellent" },
      { code: "IT502", name: "Advanced Java Programming", internal: 90, unitTest: 88, practical: 90, attendance: 92, status: "Excellent" },
      { code: "IT503", name: "Computer Networks & Security", internal: 85, unitTest: 82, practical: 88, attendance: 90, status: "Excellent" },
      { code: "IT504", name: "Enterprise Java Lab", internal: 92, unitTest: 90, practical: 94, attendance: 95, status: "Excellent" },
      { code: "IT505", name: "Cloud Computing Elective", internal: 87, unitTest: 85, practical: 88, attendance: 91, status: "Excellent" }
    ]
  },
  {
    id: "TYIT003",
    name: "Rohan Varma",
    email: "rohan.varma@student.edu",
    phone: "+91 98203 45678",
    avatar: "https://images.unsplash.com/photo-15070032111169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    dob: "2002-11-18",
    gender: "Male",
    department: "Information Technology",
    semester: 5,
    academicYear: "2025-2026",
    mentorId: "FAC002",
    mentorName: "Prof. Rajesh Shinde",
    
    attendance: 52,
    internalMarks: 41,
    unitTestMarks: 38,
    assignmentScore: 45,
    practicalScore: 50,
    backlogs: 3,
    cgpa: 4.8,
    
    feePending: true,
    feeDueAmount: 42000,
    familyIncome: 180000,
    familyIncomeBracket: "< 2L",
    parentsEducation: "Primary",
    familyResponsibilities: "Elder sibling supporting family shop",
    distanceKm: 32,
    transportMode: "Bus + Train",
    extracurricular: "None",
    
    tenthPercent: 68.0,
    twelfthPercent: 59.4,
    
    dropoutProbability: 82,
    riskLevel: "HIGH",
    predictionDate: "2026-08-28",
    lastUpdated: "2026-09-02",
    
    contributingFactors: [
      { factor: "Critical Attendance Drop (52%)", impact: "HIGH", weight: 0.42, type: "negative", description: "Attendance far below mandatory 75% threshold." },
      { factor: "3 Active Academic Backlogs", impact: "HIGH", weight: 0.36, type: "negative", description: "High backlog burden preventing exam eligibility." },
      { factor: "Poor Unit Test & Internal Marks (41%)", impact: "HIGH", weight: 0.28, type: "negative", description: "Failing multiple continuous assessment components." },
      { factor: "Significant Commute & Economic Stress", impact: "MEDIUM", weight: 0.20, type: "negative", description: "32 km distance and pending fee arrears." }
    ],
    
    subjects: [
      { code: "IT501", name: "Software Engineering", internal: 42, unitTest: 40, practical: 52, attendance: 55, status: "Critical" },
      { code: "IT502", name: "Advanced Java Programming", internal: 38, unitTest: 35, practical: 48, attendance: 50, status: "Failing" },
      { code: "IT503", name: "Computer Networks & Security", internal: 45, unitTest: 42, practical: 55, attendance: 54, status: "Warning" },
      { code: "IT504", name: "Enterprise Java Lab", internal: 50, unitTest: 48, practical: 52, attendance: 52, status: "Warning" },
      { code: "IT505", name: "Operating Systems (Backlog)", internal: 32, unitTest: 30, practical: 45, attendance: 48, status: "Failing" }
    ]
  },
