import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { importPKCS8, SignJWT } from "jose";

export type AssetStorageProvider = "local" | "drive";
export type AssetStorageTarget = AssetStorageProvider | "auto";

export type StoredAsset = {
  provider: AssetStorageProvider;
  storageKey: string;
  href: string;
  sizeLabel: string;
  metadata: Record<string, unknown>;
};

const driveServiceAccountEmail = process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_EMAIL?.trim() ?? "";
const drivePrivateKey = process.env.GOOGLE_DRIVE_PRIVATE_KEY?.trim() ?? "";
const driveRootFolderId = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID?.trim() ?? "";
const driveSharedAccount = process.env.GOOGLE_DRIVE_SHARED_ACCOUNT?.trim() ?? "vertrexsc@gmail.com";

export function isGoogleDriveConfigured() {
  return Boolean(driveServiceAccountEmail && drivePrivateKey && driveRootFolderId);
}

export function getStorageConnectionSummary() {
  return {
    googleDriveConfigured: isGoogleDriveConfigured(),
    driveSharedAccount: driveSharedAccount || null,
  };
}

export function resolveStoredAssetHref(metadata: Record<string, unknown>, storageKey: string | null) {
  const directHref = typeof metadata.href === "string" ? metadata.href : null;

  if (directHref) {
    return directHref;
  }

  const provider = typeof metadata.provider === "string" ? metadata.provider : null;

  if (provider === "local" && storageKey) {
    return `/${storageKey.replace(/^\/+/, "")}`;
  }

  if (provider === "drive") {
    const driveFileId = typeof metadata.driveFileId === "string" ? metadata.driveFileId : null;

    if (driveFileId) {
      return `https://drive.google.com/file/d/${driveFileId}/view`;
    }
  }

  return null;
}

export async function storeAssetFile(
  file: File,
  input: {
    category?: string | null;
    clientSlug?: string | null;
    projectSlug?: string | null;
    target?: AssetStorageTarget;
  },
): Promise<StoredAsset> {
  if (file.size === 0) {
    throw new Error("El archivo está vacío.");
  }

  const target = input.target ?? "auto";

  if (target === "drive") {
    if (!isGoogleDriveConfigured()) {
      throw new Error("Google Drive no está configurado todavía para Vertrex OS.");
    }

    return uploadToGoogleDrive(file, input);
  }

  if (target === "auto" && isGoogleDriveConfigured()) {
    return uploadToGoogleDrive(file, input);
  }

  return uploadToLocalStorage(file, input);
}

async function uploadToLocalStorage(
  file: File,
  input: {
    category?: string | null;
    clientSlug?: string | null;
    projectSlug?: string | null;
  },
): Promise<StoredAsset> {
  const fileName = buildStorageFileName(file.name, input);
  const dateSegment = new Date().toISOString().slice(0, 10);
  const relativeDirectory = path.join("uploads", "vertrex", dateSegment);
  const targetDirectory = path.join(process.cwd(), "public", relativeDirectory);
  const targetFile = path.join(targetDirectory, fileName);
  const bytes = Buffer.from(await file.arrayBuffer());

  await mkdir(targetDirectory, { recursive: true });
  await writeFile(targetFile, bytes);

  const storageKey = path.join(relativeDirectory, fileName).replace(/\\/g, "/");
  const href = `/${storageKey}`;

  return {
    provider: "local",
    storageKey,
    href,
    sizeLabel: formatBytes(file.size),
    metadata: {
      provider: "local",
      href,
      contentType: file.type || "application/octet-stream",
      bytes: file.size,
    },
  };
}

async function uploadToGoogleDrive(
  file: File,
  input: {
    category?: string | null;
    clientSlug?: string | null;
    projectSlug?: string | null;
  },
): Promise<StoredAsset> {
  const accessToken = await getGoogleDriveAccessToken();
  const fileName = buildStorageFileName(file.name, input);
  const metadata = {
    name: fileName,
    parents: [driveRootFolderId],
    description: [input.clientSlug, input.projectSlug, input.category].filter(Boolean).join(" · "),
  };
  const boundary = `vertrex-${randomUUID()}`;
  const head = `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n--${boundary}\r\nContent-Type: ${file.type || "application/octet-stream"}\r\n\r\n`;
  const tail = `\r\n--${boundary}--`;
  const body = new Blob([head, Buffer.from(await file.arrayBuffer()), tail]);
  const response = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,size,webViewLink,webContentLink&supportsAllDrives=true", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": `multipart/related; boundary=${boundary}`,
    },
    body,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`No fue posible subir el archivo a Google Drive: ${message}`);
  }

  const payload = (await response.json()) as {
    id: string;
    name?: string;
    size?: string;
    webViewLink?: string;
    webContentLink?: string;
  };
  const href = payload.webViewLink ?? payload.webContentLink ?? `https://drive.google.com/file/d/${payload.id}/view`;

  return {
    provider: "drive",
    storageKey: payload.id,
    href,
    sizeLabel: formatBytes(file.size),
    metadata: {
      provider: "drive",
      href,
      driveFileId: payload.id,
      driveFileName: payload.name ?? fileName,
      driveSharedAccount,
      contentType: file.type || "application/octet-stream",
      bytes: Number(payload.size ?? file.size),
    },
  };
}

async function getGoogleDriveAccessToken() {
  const key = drivePrivateKey.replace(/\\n/g, "\n");
  const privateKey = await importPKCS8(key, "RS256");
  const now = Math.floor(Date.now() / 1000);
  const assertion = await new SignJWT({ scope: "https://www.googleapis.com/auth/drive" })
    .setProtectedHeader({ alg: "RS256", typ: "JWT" })
    .setIssuer(driveServiceAccountEmail)
    .setSubject(driveServiceAccountEmail)
    .setAudience("https://oauth2.googleapis.com/token")
    .setIssuedAt(now)
    .setExpirationTime(now + 3600)
    .sign(privateKey);
  const body = new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion,
  });
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`No fue posible autenticar Google Drive: ${message}`);
  }

  const payload = (await response.json()) as { access_token?: string };

  if (!payload.access_token) {
    throw new Error("Google Drive no devolvió un access token válido.");
  }

  return payload.access_token;
}

function buildStorageFileName(
  originalName: string,
  input: {
    category?: string | null;
    clientSlug?: string | null;
    projectSlug?: string | null;
  },
) {
  const extension = path.extname(originalName);
  const baseName = path.basename(originalName, extension).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "asset";
  const prefix = [input.clientSlug, input.projectSlug, input.category]
    .filter(Boolean)
    .map((value) => String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""))
    .filter(Boolean)
    .join("-");

  return `${prefix ? `${prefix}-` : ""}${baseName}-${randomUUID().slice(0, 8)}${extension.toLowerCase()}`;
}

function formatBytes(value: number) {
  if (value < 1024) {
    return `${value} B`;
  }

  const units = ["KB", "MB", "GB", "TB"];
  let current = value / 1024;
  let index = 0;

  while (current >= 1024 && index < units.length - 1) {
    current /= 1024;
    index += 1;
  }

  return `${current.toFixed(current >= 10 ? 0 : 1)} ${units[index]}`;
}
