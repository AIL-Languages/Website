import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { SOLE_ADMIN_EMAIL } from "@/lib/auth/admin";

export const CMS_UNLOCK_COOKIE = "ail_cms_unlock";
const CMS_UNLOCK_HOURS = 8;

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("Falta AUTH_SECRET en las variables de entorno.");
  }
  return new TextEncoder().encode(`${secret}:cms-unlock`);
}

export async function createCmsUnlockToken(email: string) {
  return new SignJWT({ scope: "cms", email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(email)
    .setIssuedAt()
    .setExpirationTime(`${CMS_UNLOCK_HOURS}h`)
    .sign(getSecret());
}

export async function verifyCmsUnlockToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (
      payload.scope !== "cms" ||
      typeof payload.email !== "string" ||
      payload.email.toLowerCase() !== SOLE_ADMIN_EMAIL
    ) {
      return null;
    }
    return { email: payload.email };
  } catch {
    return null;
  }
}

export async function setCmsUnlockCookie(email: string) {
  const token = await createCmsUnlockToken(email);
  const jar = await cookies();
  jar.set(CMS_UNLOCK_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: CMS_UNLOCK_HOURS * 60 * 60,
  });
}

export async function clearCmsUnlockCookie() {
  const jar = await cookies();
  jar.delete(CMS_UNLOCK_COOKIE);
}

export async function isCmsUnlocked(): Promise<boolean> {
  const jar = await cookies();
  const token = jar.get(CMS_UNLOCK_COOKIE)?.value;
  if (!token) return false;
  return Boolean(await verifyCmsUnlockToken(token));
}
