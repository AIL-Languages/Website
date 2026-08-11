export const ATTENDANCE_STATUSES = [
  "asistio",
  "falta",
  "cancelada",
  "reprogramada",
] as const;

export type AttendanceStatus = (typeof ATTENDANCE_STATUSES)[number];

export type AttendanceRecord = {
  id: string;
  studentId: string;
  studentName: string;
  teacherId?: string;
  groupId?: string;
  date: string;
  status: AttendanceStatus;
  notes?: string;
  createdAt: string;
  createdBy: string;
};

export type SkillScores = {
  listening?: number;
  speaking?: number;
  reading?: number;
  writing?: number;
  grammar?: number;
};

export type ProgressSnapshot = {
  id: string;
  studentId: string;
  studentName: string;
  language: string;
  level: string;
  teacherId?: string;
  teacherName?: string;
  periodStart?: string;
  periodEnd?: string;
  progressPercent: number;
  skills: SkillScores;
  teacherObservations?: string;
  academicRecommendation?: string;
  source: "manual" | "smrt";
  createdAt: string;
  createdBy: string;
};

export type LevelCompletion = {
  id: string;
  studentId: string;
  studentName: string;
  language: string;
  level: string;
  progressPercent: number;
  finalExamPassed: boolean;
  speakingPassed: boolean;
  levelCompleted: boolean;
  academicAuthorized: boolean;
  authorizedBy?: string;
  authorizedByName?: string;
  authorizedAt?: string;
  hoursCompleted?: number;
  completedAt?: string;
  updatedAt: string;
};

export type Diploma = {
  id: string;
  folio: string;
  studentId: string;
  studentName: string;
  language: string;
  level: string;
  issuedAt: string;
  hours?: number;
  issuedBy: string;
  issuedByName: string;
  completionId: string;
};

export function isDiplomaEligible(completion: LevelCompletion) {
  return (
    completion.progressPercent >= 100 &&
    completion.finalExamPassed &&
    completion.speakingPassed &&
    completion.levelCompleted &&
    completion.academicAuthorized
  );
}
