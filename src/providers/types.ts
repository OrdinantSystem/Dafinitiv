export interface StructuredGenerationRequest<T> {
  operationName: string;
  systemPrompt: string;
  userPrompt: string;
  jsonSchemaName: string;
  metadata?: Record<string, string | number | boolean>;
  fallback: T;
}

export interface ProviderResult<T> {
  providerId: string;
  model: string;
  content: T;
  rawText?: string;
  usedFallback?: boolean;
  errorMessage?: string;
}

export interface ProviderAdapter {
  id: string;
  displayName: string;
  defaultModel: string;
  supportsStructuredOutput: boolean;
  generateStructured<T>(request: StructuredGenerationRequest<T>): Promise<ProviderResult<T>>;
}
