export type OptimisticLockContext = {
  entity: string;
  expected?: string | number | null;
  actual?: string | number | null;
};

export class OptimisticLockError extends Error {
  status = 409;
  context: OptimisticLockContext;

  constructor(message: string, context: OptimisticLockContext) {
    super(message);
    this.name = "OptimisticLockError";
    this.context = context;
  }
}

export function assertOptimisticLock(
  condition: boolean,
  message: string,
  context: OptimisticLockContext,
) {
  if (!condition) {
    throw new OptimisticLockError(message, context);
  }
}
