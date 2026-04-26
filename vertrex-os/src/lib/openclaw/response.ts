export type OpenClawEnvelope<T> = {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
  requestId: string;
};

export function openClawJson<T>(data: T, requestId: string, init?: ResponseInit) {
  return Response.json(
    {
      success: true,
      data,
      timestamp: new Date().toISOString(),
      requestId,
    } satisfies OpenClawEnvelope<T>,
    init,
  );
}

export function openClawError(error: string, requestId: string, status = 400) {
  return Response.json(
    {
      success: false,
      error,
      timestamp: new Date().toISOString(),
      requestId,
    } satisfies OpenClawEnvelope<never>,
    { status },
  );
}
