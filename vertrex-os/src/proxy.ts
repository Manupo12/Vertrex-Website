import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { SESSION_COOKIE_NAME } from "@/lib/auth/constants";
import { verifySessionToken } from "@/lib/auth/token";

const TEAM_PREFIXES = [
  "/",
  "/ai",
  "/analytics",
  "/assets",
  "/automations",
  "/calendar",
  "/chat",
  "/crm",
  "/docs",
  "/finance",
  "/legal",
  "/marketing",
  "/projects",
  "/settings",
  "/strategy",
  "/team",
  "/time",
  "/vault",
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const payload = token ? await verifySessionToken(token) : null;
  const isAuthenticated = Boolean(payload?.sid && payload.sub);
  const isTeamPath = isTeamProtectedPath(pathname);
  const isPortalPath = !isTeamPath && pathname !== "/login";

  if (pathname === "/login") {
    if (!isAuthenticated || !payload) {
      return NextResponse.next();
    }

    const redirectTo = payload.role === "client" ? `/portal/${payload.clientSlug ?? "budaphone"}` : "/";
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  if (!isAuthenticated || !payload) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isTeamPath && payload.role !== "team") {
    return NextResponse.redirect(new URL(`/portal/${payload.clientSlug ?? "budaphone"}`, request.url));
  }

  if (isPortalPath && payload.role === "client") {
    const clientSlug = getPortalSlugFromPathname(pathname) ?? payload.clientSlug ?? "budaphone";

    if (payload.clientSlug && payload.clientSlug !== clientSlug) {
      return NextResponse.redirect(new URL(`/portal/${payload.clientSlug}`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

function isPublicPath(pathname: string) {
  return pathname === "/login";
}

function getPortalSlugFromPathname(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);

  if (segments[0] === "portal") {
    return segments[1] ?? null;
  }

  return segments[0] ?? null;
}

function isTeamProtectedPath(pathname: string) {
  return TEAM_PREFIXES.some((prefix) => {
    if (prefix === "/") {
      return pathname === "/";
    }

    return pathname === prefix || pathname.startsWith(`${prefix}/`);
  });
}
