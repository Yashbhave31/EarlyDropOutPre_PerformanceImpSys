// ML Inference Engine Simulator (Ensemble Classifier + SHAP Explainability)
// Calculates Dropout Probability, Risk Classification, and SHAP weights based on academic & socioeconomic features

export function calculateStudentRisk(student) {
  const attendance = Number(student.attendance) || 0;
  const internalMarks = Number(student.internalMarks) || 0;
  const unitTestMarks = Number(student.unitTestMarks) || 0;
  const assignmentScore = Number(student.assignmentScore) || 0;
  const practicalScore = Number(student.practicalScore) || 0;
  const backlogs = Number(student.backlogs) || 0;
  const feePending = Boolean(student.feePending);
  const distanceKm = Number(student.distanceKm) || 0;
  const familyIncome = Number(student.familyIncome) || 400000;

  // 1. Attendance factor (Max contribution ~ 35%)
  let attendancePenalty = 0;
  if (attendance < 60) {
    attendancePenalty = (60 - attendance) * 1.4 + 25;
  } else if (attendance < 75) {
    attendancePenalty = (75 - attendance) * 1.5;
  } else {
    attendancePenalty = -((attendance - 75) * 0.6);
  }

  // 2. Academic performance (Internal, Unit Test, Practicals) (Max ~ 25%)
  const avgAcademicScore = (internalMarks * 0.4 + unitTestMarks * 0.3 + practicalScore * 0.3);
  let academicPenalty = 0;
  if (avgAcademicScore < 50) {
    academicPenalty = (50 - avgAcademicScore) * 1.2 + 15;
  } else if (avgAcademicScore < 65) {
    academicPenalty = (65 - avgAcademicScore) * 0.8;
  } else {
    academicPenalty = -((avgAcademicScore - 65) * 0.5);
  }

  // 3. Backlogs factor (High weight ~ 25%)
  let backlogPenalty = backlogs * 14;

  // 4. Assignment completion (Max ~ 10%)
  let assignmentPenalty = 0;
  if (assignmentScore < 60) {
    assignmentPenalty = (60 - assignmentScore) * 0.3 + 5;
  } else {
    assignmentPenalty = -((assignmentScore - 60) * 0.2);
  }

  // 5. Socioeconomic & Commute (Max ~ 15%)
  let socioPenalty = 0;
  if (feePending) socioPenalty += 10;
  if (familyIncome < 200000) socioPenalty += 6;
  if (distanceKm > 25) socioPenalty += 6;
  else if (distanceKm > 15) socioPenalty += 3;

  // Base institutional baseline probability
  const baseProbability = 12;

  let rawProbability = baseProbability + attendancePenalty + academicPenalty + backlogPenalty + assignmentPenalty + socioPenalty;

  // Bound probability between 4% and 96%
  const probability = Math.round(Math.max(4, Math.min(96, rawProbability)));

  // Risk Classification
  let riskLevel = "LOW";
  if (probability >= 75) {
    riskLevel = "CRITICAL";
  } else if (probability >= 60) {
    riskLevel = "HIGH";
  } else if (probability >= 35) {
    riskLevel = "MODERATE";
  } else {
    riskLevel = "LOW";
  }

  // SHAP Feature Importance Decomposition
  const contributingFactors = [];

  if (attendance < 75) {
    contributingFactors.push({
      factor: `Attendance below 75% (${attendance}%)`,
      impact: attendance < 60 ? "HIGH" : "MEDIUM",
      weight: parseFloat(((75 - attendance) * 0.02).toFixed(2)),
      type: "negative",
      description: "Low attendance reduces classroom engagement and internal viva eligibility."
    });
  } else {
    contributingFactors.push({
      factor: `Strong Attendance (${attendance}%)`,
      impact: attendance >= 85 ? "HIGH" : "MEDIUM",
      weight: -parseFloat(((attendance - 75) * 0.015).toFixed(2)),
      type: "positive",
      description: "Consistent lecture presence provides academic resilience."
    });
  }

  if (backlogs > 0) {
    contributingFactors.push({
      factor: `${backlogs} Active Backlog(s)`,
      impact: backlogs >= 2 ? "HIGH" : "MEDIUM",
      weight: parseFloat((backlogs * 0.18).toFixed(2)),
      type: "negative",
      description: "Active backlogs increase cognitive overload and year-drop risk."
    });
  } else {
    contributingFactors.push({
      factor: "Zero Academic Backlogs",
      impact: "HIGH",
      weight: -0.28,
      type: "positive",
      description: "Cleared all past semester papers with zero pending ATKTs."
    });
  }

  if (internalMarks < 60) {
    contributingFactors.push({
      factor: `Internal Marks Below Average (${internalMarks}/100)`,
      impact: internalMarks < 50 ? "HIGH" : "MEDIUM",
      weight: parseFloat(((60 - internalMarks) * 0.015).toFixed(2)),
      type: "negative",
      description: "Low continuous assessment scores signal risk in end-semester exams."
    });
  }

  if (feePending) {
    contributingFactors.push({
      factor: "Tuition Fee Dues Pending",
      impact: "MEDIUM",
      weight: 0.16,
      type: "negative",
      description: "Financial distress may disrupt examination registration."
    });
  }

  if (distanceKm >= 20) {
    contributingFactors.push({
      factor: `Long Transit Distance (${distanceKm} km)`,
      impact: "LOW",
      weight: 0.11,
      type: "negative",
      description: "Commuting over 90 mins daily reduces self-study and revision time."
    });
  }

  // Recommendations Generation
  const recommendations = generateRecommendations({
    riskLevel,
    probability,
    attendance,
    backlogs,
    internalMarks,
    feePending,
    assignmentScore
  });

  return {
    dropoutProbability: probability,
    riskLevel,
    contributingFactors,
    recommendations,
    predictionDate: new Date().toISOString().split('T')[0]
  };
}

export function generateRecommendations({ riskLevel, probability, attendance, backlogs, internalMarks, feePending, assignmentScore }) {
  const recs = [];

  if (attendance < 75) {
    recs.push({
      id: "REC-ATTENDANCE",
      title: "Attendance Improvement Contract",
      priority: "Urgent",
      category: "Attendance",
      action: "Mandate biometric logging and assign student to weekly attendance recovery target of 75%.",
      goal: `Raise attendance from ${attendance}% to 75%`,
      impact: "Reduces dropout risk by ~22%"
    });
  }

  if (backlogs > 0) {
    recs.push({
      id: "REC-BACKLOG",
      title: "Remedial Backlog Recovery Mentoring",
      priority: "High",
      category: "Academics",
      action: "Assign subject-matter faculty mentor for 3 hours of weekly problem-solving and backlog mock test series.",
      goal: `Clear ${backlogs} pending ATKT subject(s) in upcoming ATKT session`,
      impact: "Reduces dropout risk by ~28%"
    });
  }

  if (internalMarks < 60) {
    recs.push({
      id: "REC-ACADEMIC",
      title: "Continuous Assessment & Peer Tutoring",
      priority: "Medium",
      category: "Academic Support",
      action: "Pair with top-performing student peer in practical laboratories and schedule weekly revision quizzes.",
      goal: "Achieve minimum 65+ in Unit Test 2",
      impact: "Reduces dropout risk by ~15%"
    });
  }

  if (assignmentScore < 70) {
    recs.push({
      id: "REC-ASSIGNMENT",
      title: "Weekly Lab Assignment Submission Plan",
      priority: "Medium",
      category: "Coursework",
      action: "Provide structured milestone checkpoints for laboratory writeups 48 hours prior to final submission deadline.",
      goal: "Submit 100% of upcoming lab assignments on time",
      impact: "Reduces dropout risk by ~10%"
    });
  }

  if (feePending) {
    recs.push({
      id: "REC-FINANCE",
      title: "Institutional Welfare & Fee Installment Counseling",
      priority: "Medium",
      category: "Financial Support",
      action: "Assist student in applying for college emergency welfare fund or 3-part installment payment schedule.",
      goal: "Resolve registration hold without financial stress",
      impact: "Relieves student psychological burden"
    });
  }

  if (recs.length === 0) {
    recs.push({
      id: "REC-ADVANCED",
      title: "Honors Track & Career Skill Development",
      priority: "Low",
      category: "Enrichment",
      action: "Encourage student to participate in state-level hackathons, research publications, and campus placement training.",
      goal: "Maintain 8.5+ CGPA and explore industry internships",
      impact: "Career readiness"
    });
  }

  return recs;
}
