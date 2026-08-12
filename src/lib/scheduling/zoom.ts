import { saveVirtualRoom, getRoomForStudent } from "@/lib/scheduling/store";
import type { PublicUser } from "@/lib/auth/types";
import { optionLabel, languages } from "@/lib/academic/options";

/**
 * Phase 1 stub. Real Zoom OAuth lives behind env vars and is not used yet.
 * Never expose host URLs to students.
 */
export class ZoomService {
  static isConfigured() {
    return Boolean(
      process.env.ZOOM_ACCOUNT_ID &&
        process.env.ZOOM_CLIENT_ID &&
        process.env.ZOOM_CLIENT_SECRET,
    );
  }

  static topicFor(student: PublicUser) {
    const language = optionLabel(languages, student.details.language);
    return `AIL | ${language} | ${student.name}`;
  }

  /**
   * Creates or returns a per-student recurring room placeholder.
   * When Zoom credentials exist, replace the mock URLs with API results.
   */
  static async createStudentRoom(student: PublicUser) {
    const existing = await getRoomForStudent(student.id);
    if (existing) return existing;

    const meetingId = `AIL-${student.id.slice(0, 8).toUpperCase()}`;
    const joinUrl =
      process.env.ZOOM_MOCK_JOIN_URL ||
      `https://zoom.us/j/${meetingId.replace(/\D/g, "0").padEnd(10, "0").slice(0, 10)}`;

    return saveVirtualRoom({
      studentId: student.id,
      provider: "zoom",
      meetingId,
      joinUrl,
      password: process.env.ZOOM_MOCK_PASSWORD || undefined,
      encryptedHostUrl: undefined,
      topic: this.topicFor(student),
      status: "active",
    });
  }

  static async maybeCreateForActiveStudent(input: {
    student: PublicUser;
    paymentConfirmed: boolean;
    teacherId?: string | null;
    enrollmentStatus?: string;
  }) {
    if (!input.paymentConfirmed) return null;
    if (!input.teacherId) return null;
    if (input.enrollmentStatus && input.enrollmentStatus !== "active") {
      return null;
    }
    if (input.student.details.courseType === "grupo") return null;
    return this.createStudentRoom(input.student);
  }
}
