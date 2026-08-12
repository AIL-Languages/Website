export type AcademicGroup = {
  id: string;
  name: string;
  language: string;
  level: string;
  teacher: string;
  teacherId?: string;
  studentIds: string[];
  schedule: string;
  weeklyHours?: string;
  createdAt: string;
  createdBy: string;
};

export type AcademicFollowUp = {
  id: string;
  studentName: string;
  studentId?: string;
  notes: string;
  createdAt: string;
  createdBy: string;
};

export type TeacherAssignment = {
  id: string;
  studentId: string;
  teacherId: string;
  groupId?: string;
  status?: "active" | "paused" | "ended";
  assignedAt?: string;
  createdAt: string;
  createdBy: string;
};

export type ScheduleSlot = {
  id: string;
  day: string;
  start: string;
  end: string;
  teacherId?: string;
  studentId?: string;
  groupId?: string;
  notes?: string;
  createdAt: string;
  createdBy: string;
};
