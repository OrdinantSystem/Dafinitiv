function isEnabled(source: Record<string, string | undefined> = process.env): boolean {
  const value = source.APP_ENABLE_DEBUG_LOGS;
  return typeof value === "string" && value.toLowerCase() === "true";
}

export function serverDebugLog(
  scope: string,
  event: string,
  payload?: Record<string, string | number | boolean | null | undefined>
) {
  if (!isEnabled()) {
    return;
  }

  const serializedPayload = payload ? " " + JSON.stringify(payload) : "";
  console.info(`[debug:${scope}] ${new Date().toISOString()} ${event}${serializedPayload}`);
}
