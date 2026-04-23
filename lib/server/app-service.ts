import { createApplicationService } from "@/src/api/actions";

import { createWebProviderRouter } from "@/lib/server/provider-router";

let cachedBundle: ReturnType<typeof createWebApplicationService> | null = null;

export function createWebApplicationService(
  source: Record<string, string | undefined> = process.env
) {
  const providerBundle = createWebProviderRouter(source);

  return {
    env: providerBundle.env,
    runtime: providerBundle.runtime,
    service: createApplicationService(providerBundle.router)
  };
}

export function getWebApplicationService() {
  cachedBundle ??= createWebApplicationService();
  return cachedBundle;
}
