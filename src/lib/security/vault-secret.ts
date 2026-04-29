import "server-only";

import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

export type VaultSecretStorageMode = "none" | "plaintext" | "encrypted";

const PLAINTEXT_SECRET_KEY = "secret";
const SECRET_CIPHERTEXT_KEY = "secretCiphertext";
const SECRET_IV_KEY = "secretIv";
const SECRET_AUTH_TAG_KEY = "secretAuthTag";
const SECRET_VERSION_KEY = "secretVersion";
const CURRENT_SECRET_VERSION = 1;

export function resolveVaultSecretStorageMode(metadata: Record<string, unknown>): VaultSecretStorageMode {
  if (hasEncryptedVaultSecret(metadata)) {
    return "encrypted";
  }

  return readPlaintextSecret(metadata) ? "plaintext" : "none";
}

export function hasVaultSecret(metadata: Record<string, unknown>) {
  return resolveVaultSecretStorageMode(metadata) !== "none";
}

export function writeVaultSecretMetadata(metadata: Record<string, unknown>, secret: string | null) {
  const nextMetadata = stripVaultSecretMetadata(metadata);
  const normalizedSecret = normalizeSecret(secret);

  if (!normalizedSecret) {
    return nextMetadata;
  }

  const key = getVaultSecretKey();
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([cipher.update(normalizedSecret, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return {
    ...nextMetadata,
    [SECRET_CIPHERTEXT_KEY]: ciphertext.toString("base64"),
    [SECRET_IV_KEY]: iv.toString("base64"),
    [SECRET_AUTH_TAG_KEY]: authTag.toString("base64"),
    [SECRET_VERSION_KEY]: CURRENT_SECRET_VERSION,
  };
}

export function readVaultSecret(metadata: Record<string, unknown>) {
  const plaintext = readPlaintextSecret(metadata);

  if (plaintext) {
    return plaintext;
  }

  if (!hasEncryptedVaultSecret(metadata)) {
    return null;
  }

  const ciphertext = readMetadataString(metadata, SECRET_CIPHERTEXT_KEY);
  const iv = readMetadataString(metadata, SECRET_IV_KEY);
  const authTag = readMetadataString(metadata, SECRET_AUTH_TAG_KEY);

  if (!ciphertext || !iv || !authTag) {
    return null;
  }

  const decipher = createDecipheriv("aes-256-gcm", getVaultSecretKey(), Buffer.from(iv, "base64"));
  decipher.setAuthTag(Buffer.from(authTag, "base64"));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(ciphertext, "base64")),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}

function stripVaultSecretMetadata(metadata: Record<string, unknown>) {
  const nextMetadata = { ...metadata };

  delete nextMetadata[PLAINTEXT_SECRET_KEY];
  delete nextMetadata[SECRET_CIPHERTEXT_KEY];
  delete nextMetadata[SECRET_IV_KEY];
  delete nextMetadata[SECRET_AUTH_TAG_KEY];
  delete nextMetadata[SECRET_VERSION_KEY];

  return nextMetadata;
}

function hasEncryptedVaultSecret(metadata: Record<string, unknown>) {
  return Boolean(
    readMetadataString(metadata, SECRET_CIPHERTEXT_KEY)
      && readMetadataString(metadata, SECRET_IV_KEY)
      && readMetadataString(metadata, SECRET_AUTH_TAG_KEY),
  );
}

function readPlaintextSecret(metadata: Record<string, unknown>) {
  return normalizeSecret(readMetadataString(metadata, PLAINTEXT_SECRET_KEY));
}

function readMetadataString(metadata: Record<string, unknown>, key: string) {
  const value = metadata?.[key];
  return typeof value === "string" ? value : null;
}

function normalizeSecret(value: string | null | undefined) {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

function getVaultSecretKey() {
  const secretMaterial = process.env.VAULT_SECRET_KEY ?? process.env.AUTH_SECRET;

  if (!secretMaterial) {
    throw new Error("Define VAULT_SECRET_KEY o AUTH_SECRET para cifrar secretos del vault.");
  }

  return createHash("sha256").update(secretMaterial).digest();
}
