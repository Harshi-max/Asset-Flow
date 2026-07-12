export function logInfo(message: string, meta?: Record<string, unknown>) {
  console.info(`[AssetFlow] ${message}`, meta ?? {});
}

export function logError(message: string, error?: unknown) {
  console.error(`[AssetFlow] ${message}`, error);
}
