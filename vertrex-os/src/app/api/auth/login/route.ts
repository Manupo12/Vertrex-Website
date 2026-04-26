import { cookies } from "next/headers";
import { z } from "zod";

import { authenticateUser, getLoginRedirectPath, getSessionCookieOptions } from "@/lib/auth/session";

export const runtime = "nodejs";

const loginPayloadSchema = z.object({
  identifier: z.string().min(1),
  password: z.string().min(1),
  role: z.enum(["team", "client"]),
});

export async function POST(request: Request) {
  try {
    const payload = loginPayloadSchema.parse(await request.json());
    const session = await authenticateUser(payload.identifier, payload.password, payload.role);

    if (!session) {
      return Response.json({ error: "Credenciales inválidas o acceso no autorizado." }, { status: 401 });
    }

    const cookieStore = await cookies();
    cookieStore.set({
      ...getSessionCookieOptions(session.expiresAt),
      value: session.token,
      expires: session.expiresAt,
    });

    return Response.json({
      user: session.user,
      expiresAt: session.expiresAt.toISOString(),
      redirectTo: getLoginRedirectPath(session.user),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No fue posible iniciar sesión.";
    return Response.json({ error: message }, { status: 400 });
  }
}
