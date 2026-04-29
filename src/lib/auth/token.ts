import { SignJWT, jwtVerify } from "jose";

import { SESSION_COOKIE_NAME } from "@/lib/auth/constants";

export type SessionRole = "team" | "client";

export type SessionTokenPayload = {
  sid: string;
  role: SessionRole;
  email: string;
  name: string;
  clientId: string | null;
  clientSlug: string | null;
};

export async function signSessionToken(payload: SessionTokenPayload, userId: string, expiresAt: Date) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(Math.floor(expiresAt.getTime() / 1000))
    .sign(getAuthSecret());
}

export async function verifySessionToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getAuthSecret());
    return payload as SessionTokenPayload & { sub?: string };
  } catch {
    return null;
  }
}

export function getAuthSecret() {
  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error("AUTH_SECRET no está configurado. Define una clave segura para firmar sesiones.");
  }

  return new TextEncoder().encode(secret);
}

export { SESSION_COOKIE_NAME };
