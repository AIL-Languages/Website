import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "ail_session";
export const SESSION_DAYS = 14;

export type SessionPayload = {
  sub: string;
  email: string;
  name: string;
  role: "student" | "admin";
};

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("Falta AUTH_SECRET en las variables de entorno.");
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(payload: SessionPayload) {
  return new SignJWT({
    email: payload.email,
    name: payload.name,
    role: payload.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(getSecret());
}

export async function verifySessionToken(token: string) {
  const { payload } = await jwtVerify(token, getSecret());
  if (
    !payload.sub ||
    typeof payload.email !== "string" ||
    typeof payload.name !== "string"
  ) {
    return null;
  }

  const role = payload.role === "admin" ? "admin" : "student";

  return {
    sub: payload.sub,
    email: payload.email,
    name: payload.name,
    role,
  } satisfies SessionPayload;
}
