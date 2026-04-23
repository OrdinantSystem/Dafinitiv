import test from "node:test";
import assert from "node:assert/strict";

import {
  getProviderRuntimeStatus,
  isRealLlmEnabled,
  readServerEnv
} from "../lib/server/env";

test("env defaults keep the app in fallback mode", () => {
  const env = readServerEnv({});

  assert.equal(env.OPENAI_BASE_URL, "https://api.minimax.io/v1");
  assert.equal(env.OPENAI_MODEL, "MiniMax-M2.5");
  assert.equal(env.APP_ENABLE_REAL_LLM, false);
  assert.equal(isRealLlmEnabled(env), false);
  assert.equal(getProviderRuntimeStatus(env).mode, "fallback");
});

test("env enables live mode only when the flag and API key are present", () => {
  const env = readServerEnv({
    APP_ENABLE_REAL_LLM: "true",
    OPENAI_API_KEY: "secret",
    OPENAI_BASE_URL: "https://api.minimax.io/v1",
    OPENAI_MODEL: "MiniMax-M2.5"
  });

  assert.equal(isRealLlmEnabled(env), true);
  assert.equal(getProviderRuntimeStatus(env).mode, "live");
});
