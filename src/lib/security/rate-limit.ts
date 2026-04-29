import "server-only";

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

type GlobalRateLimitStore = typeof globalThis & {
  __vertrexRateLimitStore?: Map<string, RateLimitBucket>;
};

export type RateLimitResult = {
  limit: number;
  remaining: number;
  resetAt: string;
  retryAfterSeconds: number;
  key: string;
};

export type EnforceRateLimitOptions = {
  request: Request;
  namespace: string;
  max: number;
  windowMs: number;
  identifier?: string | null;
  message?: string;
};

export class RateLimitError extends Error {
  status = 429;
  retryAfterSeconds: number;
  headers: Record<string, string>;

  constructor(message: string, result: RateLimitResult) {
    super(message);
    this.name = "RateLimitError";
    this.retryAfterSeconds = result.retryAfterSeconds;
    this.headers = {
      "Retry-After": String(result.retryAfterSeconds),
      "X-RateLimit-Limit": String(result.limit),
      "X-RateLimit-Remaining": String(result.remaining),
      "X-RateLimit-Reset": result.resetAt,
    };
  }
}

export function enforceRateLimit(options: EnforceRateLimitOptions): RateLimitResult {
  const now = Date.now();
  const store = getRateLimitStore();

  pruneExpiredBuckets(store, now);

  const fingerprint = normalizeFingerprint(options.identifier) ?? readRateLimitFingerprint(options.request);
  const key = `${options.namespace}:${fingerprint}`;
  const currentBucket = store.get(key);

  if (!currentBucket || currentBucket.resetAt <= now) {
    const nextBucket = {
      count: 1,
      resetAt: now + options.windowMs,
    } satisfies RateLimitBucket;
    store.set(key, nextBucket);
    return buildRateLimitResult(key, options.max, nextBucket, now);
  }

  if (currentBucket.count >= options.max) {
    const result = buildRateLimitResult(key, options.max, currentBucket, now);
    throw new RateLimitError(options.message ?? `Demasiadas solicitudes. Intenta de nuevo en ${result.retryAfterSeconds}s.`, result);
  }

  currentBucket.count += 1;
  store.set(key, currentBucket);

  return buildRateLimitResult(key, options.max, currentBucket, now);
}

function buildRateLimitResult(key: string, limit: number, bucket: RateLimitBucket, now: number): RateLimitResult {
  return {
    key,
    limit,
    remaining: Math.max(limit - bucket.count, 0),
    resetAt: new Date(bucket.resetAt).toISOString(),
    retryAfterSeconds: Math.max(Math.ceil((bucket.resetAt - now) / 1000), 1),
  };
}

function getRateLimitStore() {
  const scope = globalThis as GlobalRateLimitStore;
  scope.__vertrexRateLimitStore ??= new Map<string, RateLimitBucket>();
  return scope.__vertrexRateLimitStore;
}

function pruneExpiredBuckets(store: Map<string, RateLimitBucket>, now: number) {
  if (store.size < 256) {
    return;
  }

  for (const [key, bucket] of store.entries()) {
    if (bucket.resetAt <= now) {
      store.delete(key);
    }
  }
}

export function readRateLimitFingerprint(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const connectingIp = request.headers.get("cf-connecting-ip");
  const userAgent = request.headers.get("user-agent") ?? "unknown-agent";
  const ip = forwardedFor?.split(",")[0]?.trim() || realIp || connectingIp || "unknown-ip";
  return `${ip}:${userAgent.slice(0, 120)}`;
}

function normalizeFingerprint(value: string | null | undefined) {
  const normalized = value?.trim().toLowerCase();
  return normalized ? normalized : null;
}
