import type { ProviderAdapter } from "./types";

export class ProviderRouter {
  private readonly providers: Map<string, ProviderAdapter>;
  private readonly defaultProviderId: string;

  constructor(providers: ProviderAdapter[], defaultProviderId: string) {
    this.providers = new Map(providers.map((provider) => [provider.id, provider]));
    this.defaultProviderId = defaultProviderId;
  }

  resolve(preferredProviderId?: string): ProviderAdapter {
    const provider =
      (preferredProviderId ? this.providers.get(preferredProviderId) : undefined) ??
      this.providers.get(this.defaultProviderId);

    if (provider === undefined) {
      throw new Error("No provider configured in ProviderRouter.");
    }

    return provider;
  }
}
