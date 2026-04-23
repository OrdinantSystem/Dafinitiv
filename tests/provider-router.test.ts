import test from "node:test";
import assert from "node:assert/strict";

import { createWebProviderRouter } from "../lib/server/provider-router";

test("provider router falls back to the local provider when live mode is disabled", () => {
  const bundle = createWebProviderRouter({
    APP_ENABLE_REAL_LLM: "false"
  });

  assert.equal(bundle.runtime.mode, "fallback");
  assert.equal(bundle.router.resolve().id, "local-fallback");
});

test("provider router prioritizes the OpenAI-compatible provider when configured", () => {
  const bundle = createWebProviderRouter({
    APP_ENABLE_REAL_LLM: "true",
    OPENAI_API_KEY: "secret",
    OPENAI_BASE_URL: "https://api.minimax.io/v1",
    OPENAI_MODEL: "MiniMax-M2.5"
  });

  assert.equal(bundle.runtime.mode, "live");
  assert.equal(bundle.router.resolve().id, "minimax-openai");
});
