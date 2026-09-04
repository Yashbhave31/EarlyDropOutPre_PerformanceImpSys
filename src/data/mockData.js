// Mock Data for Early Dropout Prediction System
// Comprehensive dataset for Academic Year 2025-2026 across Departments

export const initialStudents = [
  {
    id: "TYIT001",
    name: "Aarav Patil",
    email: "aarav.patil@student.edu",
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
    familyResponsibilities: "Elder sibling supporting family business",
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
  {
    id: "TYCS001",
    name: "Pooja Sharma",
    email: "pooja.sharma@student.edu",
    phone: "+91 98204 56789",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    dob: "2003-03-10",
    gender: "Female",
    department: "Computer Engineering",
    semester: 5,
    academicYear: "2025-2026",
    mentorId: "FAC003",
    mentorName: "Dr. Vikram Joshi",
    
    attendance: 84,
    internalMarks: 76,
    unitTestMarks: 72,
    assignmentScore: 82,
    practicalScore: 80,
    backlogs: 0,
    cgpa: 7.8,
    
    feePending: false,
    feeDueAmount: 0,
    familyIncome: 550000,
    familyIncomeBracket: "3L - 6L",
    parentsEducation: "Graduate",
    familyResponsibilities: "None",
    distanceKm: 12,
    transportMode: "Metro",
    extracurricular: "Medium",
    
    tenthPercent: 86.5,
    twelfthPercent: 81.2,
    
    dropoutProbability: 16,
    riskLevel: "LOW",
    predictionDate: "2026-08-28",
    lastUpdated: "2026-09-02",
    
    contributingFactors: [
      { factor: "Good Attendance (84%)", impact: "MEDIUM", weight: -0.25, type: "positive", description: "Regular lecture and lab participation." },
      { factor: "Zero Backlogs & Solid CGPA (7.8)", impact: "HIGH", weight: -0.28, type: "positive", description: "Clear academic record with steady progression." },
      { factor: "Steady Continuous Assessment", impact: "LOW", weight: -0.15, type: "positive", description: "Above average test performance." }
    ],
    
    subjects: [
      { code: "CS501", name: "Theory of Computation", internal: 74, unitTest: 70, practical: 80, attendance: 86, status: "Passing" },
      { code: "CS502", name: "Database Management Systems", internal: 78, unitTest: 75, practical: 82, attendance: 84, status: "Passing" },
      { code: "CS503", name: "Computer Architecture", internal: 72, unitTest: 68, practical: 78, attendance: 82, status: "Passing" },
      { code: "CS504", name: "Web Development Lab", internal: 82, unitTest: 80, practical: 85, attendance: 88, status: "Passing" }
    ]
  },
  {
    id: "TYCS002",
    name: "Vikram Jadhav",
    email: "vikram.jadhav@student.edu",
    phone: "+91 98205 67890",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    dob: "2003-07-29",
    gender: "Male",
    department: "Computer Engineering",
    semester: 5,
    academicYear: "2025-2026",
    mentorId: "FAC003",
    mentorName: "Dr. Vikram Joshi",
    
    attendance: 59,
    internalMarks: 48,
    unitTestMarks: 45,
    assignmentScore: 55,
    practicalScore: 58,
    backlogs: 2,
    cgpa: 5.2,
    
    feePending: true,
    feeDueAmount: 35000,
    familyIncome: 220000,
    familyIncomeBracket: "1L - 3L",
    parentsEducation: "High School",
    familyResponsibilities: "Support family agricultural transport",
    distanceKm: 28,
    transportMode: "State Bus",
    extracurricular: "Low",
    
    tenthPercent: 72.0,
    twelfthPercent: 63.8,
    
    dropoutProbability: 71,
    riskLevel: "HIGH",
    predictionDate: "2026-08-28",
    lastUpdated: "2026-09-02",
    
    contributingFactors: [
      { factor: "Attendance Below Mandatory 60%", impact: "HIGH", weight: 0.38, type: "negative", description: "Severely low lecture attendance causing academic backlog." },
      { factor: "2 Active Academic Backlogs", impact: "HIGH", weight: 0.30, type: "negative", description: "Pending ATKT in Discrete Maths & Data Structures." },
      { factor: "Tuition Fee Outstanding", impact: "MEDIUM", weight: 0.16, type: "negative", description: "Pending term fees risking hall ticket generation." }
    ],
    
    subjects: [
      { code: "CS501", name: "Theory of Computation", internal: 44, unitTest: 40, practical: 55, attendance: 58, status: "Critical" },
      { code: "CS502", name: "Database Management Systems", internal: 50, unitTest: 48, practical: 60, attendance: 62, status: "Warning" },
      { code: "CS503", name: "Computer Architecture", internal: 46, unitTest: 42, practical: 56, attendance: 57, status: "Critical" },
      { code: "CS504", name: "Web Development Lab", internal: 58, unitTest: 55, practical: 62, attendance: 61, status: "Warning" }
    ]
  },
  {
    id: "TYAI001",
    name: "Ananya Mehta",
    email: "ananya.mehta@student.edu",
    phone: "+91 98206 78901",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    dob: "2003-04-12",
    gender: "Female",
    department: "Artificial Intelligence & Data Science",
    semester: 5,
    academicYear: "2025-2026",
    mentorId: "FAC004",
    mentorName: "Prof. Priya Nair",
    
    attendance: 88,
    internalMarks: 82,
    unitTestMarks: 80,
    assignmentScore: 86,
    practicalScore: 88,
    backlogs: 0,
    cgpa: 8.4,
    
    feePending: false,
    feeDueAmount: 0,
    familyIncome: 620000,
    familyIncomeBracket: "> 6L",
    parentsEducation: "Postgraduate",
    familyResponsibilities: "None",
    distanceKm: 8,
    transportMode: "Two Wheeler",
    extracurricular: "High",
    
    tenthPercent: 89.0,
    twelfthPercent: 85.2,
    
    dropoutProbability: 11,
    riskLevel: "LOW",
    predictionDate: "2026-08-28",
    lastUpdated: "2026-09-02",
    
    contributingFactors: [
      { factor: "High Attendance (88%)", impact: "HIGH", weight: -0.32, type: "positive", description: "Regular participation in theoretical lectures." },
      { factor: "No Backlogs & 8.4 CGPA", impact: "HIGH", weight: -0.30, type: "positive", description: "Consistently cleared all semesters." }
    ],
    
    subjects: [
      { code: "AI501", name: "Machine Learning Core", internal: 84, unitTest: 82, practical: 90, attendance: 90, status: "Excellent" },
      { code: "AI502", name: "Deep Learning Foundations", internal: 80, unitTest: 78, practical: 86, attendance: 88, status: "Excellent" },
      { code: "AI503", name: "Big Data Processing", internal: 82, unitTest: 80, practical: 88, attendance: 86, status: "Excellent" }
    ]
  },
  {
    id: "TYAI002",
    name: "Sameer Sheikh",
    email: "sameer.sheikh@student.edu",
    phone: "+91 98207 89012",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    dob: "2003-10-05",
    gender: "Male",
    department: "Artificial Intelligence & Data Science",
    semester: 5,
    academicYear: "2025-2026",
    mentorId: "FAC004",
    mentorName: "Prof. Priya Nair",
    
    attendance: 71,
    internalMarks: 64,
    unitTestMarks: 60,
    assignmentScore: 68,
    practicalScore: 70,
    backlogs: 1,
    cgpa: 6.7,
    
    feePending: false,
    feeDueAmount: 0,
    familyIncome: 380000,
    familyIncomeBracket: "3L - 6L",
    parentsEducation: "Graduate",
    familyResponsibilities: "Family clinic assistance",
    distanceKm: 14,
    transportMode: "Metro",
    extracurricular: "Medium",
    
    tenthPercent: 81.2,
    twelfthPercent: 74.5,
    
    dropoutProbability: 38,
    riskLevel: "MEDIUM",
    predictionDate: "2026-08-28",
    lastUpdated: "2026-09-02",
    
    contributingFactors: [
      { factor: "Borderline Attendance (71%)", impact: "MEDIUM", weight: 0.22, type: "negative", description: "Attendance marginally below university norm." },
      { factor: "1 Active Backlog (Linear Algebra)", impact: "MEDIUM", weight: 0.20, type: "negative", description: "Pending math ATKT creating subject barrier." }
    ],
    
    subjects: [
      { code: "AI501", name: "Machine Learning Core", internal: 66, unitTest: 62, practical: 72, attendance: 72, status: "Passing" },
      { code: "AI502", name: "Deep Learning Foundations", internal: 60, unitTest: 58, practical: 68, attendance: 70, status: "Warning" },
      { code: "AI503", name: "Big Data Processing", internal: 68, unitTest: 62, practical: 72, attendance: 71, status: "Passing" }
    ]
  },
  {
    id: "TYEXTC001",
    name: "Kavita Nair",
    email: "kavita.nair@student.edu",
    phone: "+91 98208 90123",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    dob: "2003-01-20",
    gender: "Female",
    department: "Electronics & Telecommunication",
    semester: 5,
    academicYear: "2025-2026",
    mentorId: "FAC005",
    mentorName: "Prof. Sandeep Rao",
    
    attendance: 64,
    internalMarks: 53,
    unitTestMarks: 50,
    assignmentScore: 62,
    practicalScore: 66,
    backlogs: 2,
    cgpa: 5.9,
    
    feePending: true,
    feeDueAmount: 31000,
    familyIncome: 210000,
    familyIncomeBracket: "1L - 3L",
    parentsEducation: "High School",
    familyResponsibilities: "Assisting family bakery",
    distanceKm: 22,
    transportMode: "Bus",
    extracurricular: "Low",
    
    tenthPercent: 76.5,
    twelfthPercent: 67.2,
    
    dropoutProbability: 66,
    riskLevel: "HIGH",
    predictionDate: "2026-08-28",
    lastUpdated: "2026-09-02",
    
    contributingFactors: [
      { factor: "Attendance Below 65%", impact: "HIGH", weight: 0.34, type: "negative", description: "Frequent absenteeism during morning circuit labs." },
      { factor: "2 Backlogs in Core Subjects", impact: "HIGH", weight: 0.32, type: "negative", description: "Signals & Systems and Analog Circuits pending." },
      { factor: "Outstanding Fee Dues", impact: "MEDIUM", weight: 0.15, type: "negative", description: "Semester fee installment unresolved." }
    ],
    
    subjects: [
      { code: "EX501", name: "Signals & Systems", internal: 48, unitTest: 45, practical: 62, attendance: 62, status: "Critical" },
      { code: "EX502", name: "Electromagnetics", internal: 52, unitTest: 50, practical: 68, attendance: 65, status: "Warning" },
      { code: "EX503", name: "Microprocessors", internal: 58, unitTest: 55, practical: 70, attendance: 66, status: "Passing" }
    ]
  }
];

export const facultyMembers = [
  {
    id: "FAC001",
    name: "Dr. Anjali Deshmukh",
    email: "anjali.deshmukh@faculty.edu",
    department: "Information Technology",
    designation: "Associate Professor & HOD",
    phone: "+91 98200 11223",
    avatar: "https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?w=150&auto=format&fit=crop&q=80",
    assignedStudentsCount: 22,
    highRiskCount: 3,
    office: "Room 402, IT Block",
    specialization: "Data Mining & Machine Learning"
  },
  {
    id: "FAC002",
    name: "Prof. Rajesh Shinde",
    email: "rajesh.shinde@faculty.edu",
    department: "Information Technology",
    designation: "Assistant Professor",
    phone: "+91 98200 22334",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80",
    assignedStudentsCount: 20,
    highRiskCount: 5,
    office: "Room 405, IT Block",
    specialization: "Cloud Computing & Networks"
  },
  {
    id: "FAC003",
    name: "Dr. Vikram Joshi",
    email: "vikram.joshi@faculty.edu",
    department: "Computer Engineering",
    designation: "Professor & Academic Dean",
    phone: "+91 98200 33445",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    assignedStudentsCount: 25,
    highRiskCount: 4,
    office: "Room 301, Main Block",
    specialization: "Algorithms & Distributed Systems"
  },
  {
    id: "FAC004",
    name: "Prof. Priya Nair",
    email: "priya.nair@faculty.edu",
    department: "Artificial Intelligence & Data Science",
    designation: "Assistant Professor",
    phone: "+91 98200 44556",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    assignedStudentsCount: 18,
    highRiskCount: 2,
    office: "Room 208, AI Lab Center",
    specialization: "Deep Learning & NLP"
  },
  {
    id: "FAC005",
    name: "Prof. Sandeep Rao",
    email: "sandeep.rao@faculty.edu",
    department: "Electronics & Telecommunication",
    designation: "Associate Professor",
    phone: "+91 98200 55667",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    assignedStudentsCount: 20,
    highRiskCount: 4,
    office: "Room 105, EXTC Lab",
    specialization: "Embedded Systems & IoT"
  }
];

export const departmentStats = [
  {
    department: "Information Technology",
    code: "IT",
    totalStudents: 142,
    lowRisk: 86,
    mediumRisk: 38,
    highRisk: 18,
    avgAttendance: 77.4,
    retentionRate: 91.2,
    facultyCount: 8,
    activeInterventions: 14
  },
  {
    department: "Computer Engineering",
    code: "CS",
    totalStudents: 180,
    lowRisk: 115,
    mediumRisk: 45,
    highRisk: 20,
    avgAttendance: 79.8,
    retentionRate: 92.6,
    facultyCount: 10,
    activeInterventions: 16
  },
  {
    department: "Artificial Intelligence & Data Science",
    code: "AI&DS",
    totalStudents: 120,
    lowRisk: 88,
    mediumRisk: 24,
    highRisk: 8,
    avgAttendance: 82.5,
    retentionRate: 94.8,
    facultyCount: 6,
    activeInterventions: 7
  },
  {
    department: "Electronics & Telecommunication",
    code: "EXTC",
    totalStudents: 110,
    lowRisk: 62,
    mediumRisk: 32,
    highRisk: 16,
    avgAttendance: 73.1,
    retentionRate: 87.4,
    facultyCount: 7,
    activeInterventions: 12
  }
];

export const initialInterventions = [
  {
    id: "INT-2026-001",
    studentId: "TYIT003",
    studentName: "Rohan Varma",
    studentDepartment: "Information Technology",
    studentRisk: "HIGH",
    facultyId: "FAC002",
    facultyName: "Prof. Rajesh Shinde",
    type: "Counseling & Attendance Contract",
    date: "2026-08-30",
    description: "Conducted 1-on-1 counseling regarding 52% attendance and 3 pending ATKT backlogs.",
    actionPlan: "Biometric attendance tracking mandated. Scheduled 3 hours of weekly peer tutoring with top scoring student for Operating Systems backlog.",
    followUpDate: "2026-09-15",
    status: "In Progress",
    improvementStatus: "Attendance up from 52% to 58% this week",
    remarks: "Parent contacted. Student committed to reducing outside family shop hours to morning shifts only."
  },
  {
    id: "INT-2026-002",
    studentId: "TYCS002",
    studentName: "Vikram Jadhav",
    studentDepartment: "Computer Engineering",
    studentRisk: "HIGH",
    facultyId: "FAC003",
    facultyName: "Dr. Vikram Joshi",
    type: "Academic Remedial Classes",
    date: "2026-08-27",
    description: "Identified student struggling in Discrete Mathematics and Data Structures internal exams.",
    actionPlan: "Assigned mentor support session every Tuesday and Thursday at 4 PM in Seminar Hall.",
    followUpDate: "2026-09-12",
    status: "In Progress",
    improvementStatus: "Attended 3 out of 3 remedial classes",
    remarks: "Student shows strong willingness to recover. Library book bank issued."
  },
  {
    id: "INT-2026-003",
    studentId: "TYIT001",
    studentName: "Aarav Patil",
    studentDepartment: "Information Technology",
    studentRisk: "MODERATE",
    facultyId: "FAC001",
    facultyName: "Dr. Anjali Deshmukh",
    type: "Financial & Fee Installment Counseling",
    date: "2026-08-25",
    reason: "Pending tuition fee balance (₹28,500) causing exam registration debarment anxiety",
    notes: "Assisted in submitting emergency welfare installment petition. Account hold lifted with bursar.",
    actionPlan: "Submitted emergency student welfare installment application for 3-part deferred payment schedule.",
    followUpDate: "2026-09-10",
    status: "Completed",
    improvementStatus: "First installment settled, exam hall ticket hold cleared",
    remarks: "Student relieved from examination debarment anxiety."
  },
  {
    id: "INT-2026-005",
    studentId: "TYIT001",
    studentName: "Aarav Patil",
    studentDepartment: "Information Technology",
    studentRisk: "MODERATE",
    facultyId: "FAC001",
    facultyName: "Dr. Anjali Deshmukh",
    type: "Attendance Recovery & Backlog Contract",
    date: "2026-08-28",
    reason: "Attendance dropped to 68% and active ATKT backlog in Database Systems (IT505)",
    notes: "Identified conflict with evening part-time family shop hours. Agreed to shift work hours exclusively to morning shifts.",
    actionPlan: "Biometric attendance tracking mandated. Paired with peer tutor Sneha Kulkarni for 3 hours weekly backlog problem-solving sessions.",
    followUpDate: "2026-09-16",
    status: "In Progress",
    improvementStatus: "Attended 8 out of 8 lectures in Software Engineering & Networks this week",
    remarks: "Student proactive and receptive to peer guidance."
  },
  {
    id: "INT-2026-006",
    studentId: "TYIT001",
    studentName: "Aarav Patil",
    studentDepartment: "Information Technology",
    studentRisk: "MODERATE",
    facultyId: "FAC001",
    facultyName: "Dr. Anjali Deshmukh",
    type: "Mid-Term Progress Audit & Viva Preparation",
    date: "2026-09-18",
    reason: "Mandatory departmental milestone review prior to Unit Test 2 and continuous assessment freeze",
    notes: "Scheduled in Room 402, IT Department Seminar Hall at 3:30 PM.",
    actionPlan: "Audit Unit Test 2 preparation blueprint, review solved mock exam papers, and evaluate completed Enterprise Java laboratory journal.",
    followUpDate: "2026-09-25",
    status: "Scheduled",
    improvementStatus: "Session planned on institutional calendar",
    remarks: "Reminders sent to both student and faculty mentor."
  },
  {
    id: "INT-2026-007",
    studentId: "TYIT001",
    studentName: "Aarav Patil",
    studentDepartment: "Information Technology",
    studentRisk: "MODERATE",
    facultyId: "FAC001",
    facultyName: "Dr. Anjali Deshmukh",
    type: "Lab Practical Assignment Verification",
    date: "2026-09-01",
    reason: "Pending code execution checkpoints in Advanced Java Programming (IT502)",
    notes: "Student has completed 2 out of 4 required programming experiments. Practical viva evaluation due.",
    actionPlan: "Complete remaining 2 lab experiments in evening open lab hours before Friday verification deadline.",
    followUpDate: "2026-09-08",
    status: "Follow-up Required",
    improvementStatus: "Pending submission of Experiment 3 and 4",
    remarks: "Requires faculty signature on laboratory index before Friday."
  },
  {
    id: "INT-2026-004",
    studentId: "TYEXTC001",
    studentName: "Kavita Nair",
    studentDepartment: "Electronics & Telecommunication",
    studentRisk: "HIGH",
    facultyId: "FAC005",
    facultyName: "Prof. Sandeep Rao",
    type: "Mentorship & Lab Rescheduling",
    date: "2026-08-29",
    description: "Student missing morning 8 AM circuit laboratory sessions due to long 22 km bus transit.",
    actionPlan: "Permitted batch swap to 11 AM practical slot. Provided recorded lecture repository access.",
    followUpDate: "2026-09-18",
    status: "In Progress",
    improvementStatus: "Attended all afternoon practicals without absence",
    remarks: "Immediate punctuality improvement observed."
  }
];

export const initialNotifications = [
  {
    id: "NOTIF-001",
    title: "High Risk Drop Alert",
    message: "Student Rohan Varma (TYIT003) crossed 80% dropout risk threshold following Unit Test 1 marks intake.",
    timestamp: "10 mins ago",
    read: false,
    actionUrl: "/faculty/predictions",
    type: "warning"
  },
  {
    id: "NOTIF-002",
    title: "Intervention Review Due",
    message: "Follow-up session scheduled for Vikram Jadhav (TYCS002) in Academic Remedial Program.",
    timestamp: "2 hours ago",
    read: false,
    actionUrl: "/faculty/interventions",
    type: "info"
  },
  {
    id: "NOTIF-003",
    title: "Batch ML Inference Complete",
    message: "Model inference refreshed for 552 enrolled students. Institutional risk index down by 1.8%.",
    timestamp: "1 day ago",
    read: true,
    actionUrl: "/admin/analytics",
    type: "success"
  },
  {
    id: "NOTIF-004",
    title: "Fee Installment Verified",
    message: "Aarav Patil's institutional welfare fee petition approved by Dean of Academic Affairs.",
    timestamp: "2 days ago",
    read: true,
    actionUrl: "/admin/students",
    type: "success"
  }
];

export const systemLogs = [
  {
    id: "LOG-1001",
    timestamp: "2026-09-03 10:14:22",
    event: "BATCH_ML_PREDICTION_RUN",
    user: "System Daemon (Automated)",
    status: "SUCCESS",
    details: "Processed 552 student vectors through Ensemble Gradient Boosting model with SHAP decomposition."
  },
  {
    id: "LOG-1002",
    timestamp: "2026-09-03 09:45:10",
    event: "INTERVENTION_STATUS_UPDATE",
    user: "Dr. Anjali Deshmukh (FAC001)",
    status: "SUCCESS",
    details: "Updated INT-2026-003 status to 'Completed'. Fee installment verified."
  },
  {
    id: "LOG-1003",
    timestamp: "2026-09-02 16:30:00",
    event: "STUDENT_RECORD_MODIFIED",
    user: "Prof. Rajesh Shinde (FAC002)",
    status: "SUCCESS",
    details: "Updated Unit Test 1 marks for student Rohan Varma (TYIT003)."
  },
  {
    id: "LOG-1004",
    timestamp: "2026-09-02 11:20:15",
    event: "DATA_EXPORT_CSV",
    user: "Admin (Admin Workspace)",
    status: "SUCCESS",
    details: "Exported High-Risk Student Intervention List to CSV (48 records)."
  }
];
