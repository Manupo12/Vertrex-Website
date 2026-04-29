export const teamSubroleValues = ["admin", "ops", "dev", "growth", "finance_legal", "support"] as const;

export type TeamSubrole = (typeof teamSubroleValues)[number];

export const teamCapabilityValues = [
  "crm",
  "projects",
  "documents",
  "finance",
  "portal",
  "vault",
  "support",
  "automations",
  "settings",
] as const;

export type TeamCapability = (typeof teamCapabilityValues)[number];

export const teamSubroleLabels: Record<TeamSubrole, string> = {
  admin: "Admin",
  ops: "Ops",
  dev: "Dev",
  growth: "Growth",
  finance_legal: "Finance & Legal",
  support: "Support",
};

export const teamCapabilityLabels: Record<TeamCapability, string> = {
  crm: "CRM",
  projects: "Projects",
  documents: "Documents",
  finance: "Finance",
  portal: "Portal",
  vault: "Vault",
  support: "Support",
  automations: "Automations",
  settings: "Settings",
};

const defaultCapabilitiesBySubrole: Record<TeamSubrole, TeamCapability[]> = {
  admin: [...teamCapabilityValues],
  ops: ["crm", "projects", "portal", "support"],
  dev: ["projects", "documents", "automations"],
  growth: ["crm", "projects", "documents", "portal"],
  finance_legal: ["documents", "finance", "vault"],
  support: ["portal", "support", "crm"],
};

export function normalizeTeamSubrole(value: string | null | undefined): TeamSubrole | null {
  if (!value) {
    return null;
  }

  return teamSubroleValues.find((subrole) => subrole === value) ?? null;
}

export function normalizeTeamCapabilities(values: string[] | null | undefined): TeamCapability[] {
  if (!values?.length) {
    return [];
  }

  const normalized = new Set<TeamCapability>();

  for (const value of values) {
    const capability = teamCapabilityValues.find((entry) => entry === value);

    if (capability) {
      normalized.add(capability);
    }
  }

  return teamCapabilityValues.filter((capability) => normalized.has(capability));
}

export function getDefaultCapabilitiesForSubrole(subrole: TeamSubrole | null | undefined) {
  if (!subrole) {
    return [];
  }

  return [...defaultCapabilitiesBySubrole[subrole]];
}

export type PermissionCheckInput = {
  userSubrole: TeamSubrole | null;
  userCapabilities: TeamCapability[];
  requiredCapability: TeamCapability;
  action?: "read" | "write" | "delete" | "admin";
};

export function can(input: PermissionCheckInput): boolean {
  const { userSubrole, userCapabilities, requiredCapability } = input;

  // Admin can do everything
  if (userSubrole === "admin") {
    return true;
  }

  // Check if user has the required capability
  return userCapabilities.includes(requiredCapability);
}

export function canWithSubrole(
  userSubrole: TeamSubrole | null,
  allowedSubroles: TeamSubrole[]
): boolean {
  if (!userSubrole) {
    return false;
  }

  return allowedSubroles.includes(userSubrole);
}
