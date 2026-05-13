'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const {
  MODEL_PRICING,
  AI_CREDIT_USD,
  calculateModelUsage,
  calculateAllModels,
  validateTokenUsage
} = require('../assets/calculator-core.js');

function assertApproximately(actual, expected, epsilon = 1e-9) {
  assert.ok(
    Math.abs(actual - expected) <= epsilon,
    `expected ${actual} to be within ${epsilon} of ${expected}`
  );
}

test('MODEL_PRICING has models', () => {
  assert.ok(MODEL_PRICING.length > 0);
});

test('MODEL_PRICING matches the official models-and-pricing table', () => {
  const expectedIds = [
    'gpt-4.1',
    'gpt-5-mini',
    'gpt-5.2',
    'gpt-5.2-codex',
    'gpt-5.3-codex',
    'gpt-5.4',
    'gpt-5.4-mini',
    'gpt-5.4-nano',
    'gpt-5.5',
    'claude-haiku-4.5',
    'claude-sonnet-4',
    'claude-sonnet-4.5',
    'claude-sonnet-4.6',
    'claude-opus-4.5',
    'claude-opus-4.6',
    'claude-opus-4.7',
    'gemini-2.5-pro',
    'gemini-3-flash',
    'gemini-3.1-pro',
    'grok-code-fast-1',
    'raptor-mini',
    'goldeneye'
  ];
  assert.deepEqual(MODEL_PRICING.map((model) => model.id), expectedIds);
});

test('validateTokenUsage normalizes missing optional values', () => {
  const usage = validateTokenUsage({ inputTokens: 1000 });
  assert.deepEqual(usage, {
    inputTokens: 1000,
    cachedInputTokens: 0,
    outputTokens: 0,
    cacheWriteTokens: 0
  });
});

test('calculateModelUsage: GPT-4.1 input 1M tokens', () => {
  const gpt41 = MODEL_PRICING.find((m) => m.id === 'gpt-4.1');
  const result = calculateModelUsage(gpt41, { inputTokens: 1000000 });

  assertApproximately(result.estimatedCostUsd, 2.0);
  assertApproximately(result.estimatedAiCredits, 2.0 / AI_CREDIT_USD);
});

test('calculateModelUsage: Claude includes cache write', () => {
  const claude = MODEL_PRICING.find((m) => m.id === 'claude-sonnet-4');
  const result = calculateModelUsage(claude, {
    inputTokens: 1000000,
    cachedInputTokens: 1000000,
    outputTokens: 1000000,
    cacheWriteTokens: 1000000
  });

  assertApproximately(result.estimatedCostUsd, 22.05);
  assertApproximately(result.estimatedAiCredits, 2205);
});

test('calculateAllModels returns all models sorted by cost desc', () => {
  const results = calculateAllModels({ inputTokens: 1000000 });
  assert.equal(results.length, MODEL_PRICING.length);
  assert.ok(results[0].estimatedCostUsd >= results[1].estimatedCostUsd);
});

test('throws on invalid input tokens', () => {
  assert.throws(
    () => calculateAllModels({ inputTokens: -1 }),
    /inputTokens must be a non-negative finite number/
  );
});

test('throws when modelPricing is invalid', () => {
  assert.throws(
    () => calculateModelUsage(null, { inputTokens: 1 }),
    /modelPricing must include rates/
  );
});
