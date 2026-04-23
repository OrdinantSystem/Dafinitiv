const test = require('node:test');
const assert = require('node:assert/strict');

const nextConfig = require('../next.config.js');

test('next config allows the known alternate local dev origins', () => {
  assert.ok(Array.isArray(nextConfig.allowedDevOrigins), 'allowedDevOrigins should be configured');
  assert.ok(nextConfig.allowedDevOrigins.includes('127.0.0.1'));
  assert.ok(nextConfig.allowedDevOrigins.includes('51.75.67.76'));
});
