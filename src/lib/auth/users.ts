import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { hashPassword } from "@/lib/auth/password";
import { APP_DATA_DIR } from "@/lib/paths";

export type UserRole = "student" | "admin";

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  interest?: string;
  passwordHash: string;
  role: UserRole;
  createdAt: string;
  createdBy?: string;
};

export type PublicUser = Omit<UserRecord, "passwordHash">;

const USERS_FILE = path.join(APP_DATA_DIR, "users.json");

async function ensureStore() {
  await mkdir(APP_DATA_DIR, { recursive: true });
  try {
    await readFile(USERS_FILE, "utf8");
  } catch {
    await writeFile(USERS_FILE, "[]\n", "utf8");
  }
}

async function readUsers(): Promise<UserRecord[]> {
  await ensureStore();
  const raw = await readFile(USERS_FILE, "utf8");
  try {
    const parsed = JSON.parse(raw || "[]") as UserRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeUsers(users: UserRecord[]) {
  await ensureStore();
  await writeFile(USERS_FILE, `${JSON.stringify(users, null, 2)}\n`, "utf8");
}

export function toPublicUser(user: UserRecord): PublicUser {
  const { passwordHash: _passwordHash, ...publicUser } = user;
  return publicUser;
}

export async function listUsers() {
  const users = await readUsers();
  return users.map(toPublicUser);
}

export async function findUserByEmail(email: string) {
  const normalized = email.trim().toLowerCase();
  const users = await readUsers();
  return users.find((user) => user.email === normalized) ?? null;
}

export async function findUserById(id: string) {
  const users = await readUsers();
  return users.find((user) => user.id === id) ?? null;
}

type CreateUserInput = {
  name: string;
  email: string;
  password: string;
  phone?: string;
  interest?: string;
  role?: UserRole;
  createdBy?: string;
};

export async function createUser(input: CreateUserInput) {
  const users = await readUsers();
  const email = input.email.trim().toLowerCase();

  if (users.some((user) => user.email === email)) {
    throw new Error("EMAIL_TAKEN");
  }

  const user: UserRecord = {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    email,
    phone: input.phone?.trim() || undefined,
    interest: input.interest?.trim() || undefined,
    passwordHash: await hashPassword(input.password),
    role: input.role ?? (users.length === 0 ? "admin" : "student"),
    createdAt: new Date().toISOString(),
    createdBy: input.createdBy,
  };

  users.push(user);
  await writeUsers(users);
  return toPublicUser(user);
}
