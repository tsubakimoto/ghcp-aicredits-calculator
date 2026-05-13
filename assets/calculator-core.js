'use strict';

(function initCalculatorCore(globalScope) {
  const TOKENS_PER_MILLION = 1000000;
  const AI_CREDIT_USD = 0.01;

  // Source: https://docs.github.com/en/copilot/reference/copilot-billing/models-and-pricing
  // Keep this table aligned with the official "Models and pricing" page.
  const MODEL_PRICING = Object.freeze([
    { id: 'gpt-4.1', provider: 'OpenAI', model: 'GPT-4.1', releaseStatus: 'GA', category: 'Versatile', rates: { input: 2.0, cachedInput: 0.5, output: 8.0, cacheWrite: 0 } },
    { id: 'gpt-5-mini', provider: 'OpenAI', model: 'GPT-5 mini', releaseStatus: 'GA', category: 'Lightweight', rates: { input: 0.25, cachedInput: 0.025, output: 2.0, cacheWrite: 0 } },
    { id: 'gpt-5.2', provider: 'OpenAI', model: 'GPT-5.2', releaseStatus: 'GA', category: 'Versatile', rates: { input: 1.75, cachedInput: 0.175, output: 14.0, cacheWrite: 0 } },
    { id: 'gpt-5.2-codex', provider: 'OpenAI', model: 'GPT-5.2-Codex', releaseStatus: 'GA', category: 'Powerful', rates: { input: 1.75, cachedInput: 0.175, output: 14.0, cacheWrite: 0 } },
    { id: 'gpt-5.3-codex', provider: 'OpenAI', model: 'GPT-5.3-Codex', releaseStatus: 'GA', category: 'Powerful', rates: { input: 1.75, cachedInput: 0.175, output: 14.0, cacheWrite: 0 } },
    { id: 'gpt-5.4', provider: 'OpenAI', model: 'GPT-5.4', releaseStatus: 'GA', category: 'Versatile', rates: { input: 2.5, cachedInput: 0.25, output: 15.0, cacheWrite: 0 }, notes: 'Prompts ≤272K tokens' },
    { id: 'gpt-5.4-mini', provider: 'OpenAI', model: 'GPT-5.4 mini', releaseStatus: 'GA', category: 'Lightweight', rates: { input: 0.75, cachedInput: 0.075, output: 4.5, cacheWrite: 0 } },
    { id: 'gpt-5.4-nano', provider: 'OpenAI', model: 'GPT-5.4 nano', releaseStatus: 'GA', category: 'Lightweight', rates: { input: 0.2, cachedInput: 0.02, output: 1.25, cacheWrite: 0 } },
    { id: 'gpt-5.5', provider: 'OpenAI', model: 'GPT-5.5', releaseStatus: 'GA', category: 'Powerful', rates: { input: 5.0, cachedInput: 0.5, output: 30.0, cacheWrite: 0 } },
    { id: 'claude-haiku-4.5', provider: 'Anthropic', model: 'Claude Haiku 4.5', releaseStatus: 'GA', category: 'Versatile', rates: { input: 1.0, cachedInput: 0.1, output: 5.0, cacheWrite: 1.25 } },
    { id: 'claude-sonnet-4', provider: 'Anthropic', model: 'Claude Sonnet 4', releaseStatus: 'GA', category: 'Versatile', rates: { input: 3.0, cachedInput: 0.3, output: 15.0, cacheWrite: 3.75 } },
    { id: 'claude-sonnet-4.5', provider: 'Anthropic', model: 'Claude Sonnet 4.5', releaseStatus: 'GA', category: 'Versatile', rates: { input: 3.0, cachedInput: 0.3, output: 15.0, cacheWrite: 3.75 } },
    { id: 'claude-sonnet-4.6', provider: 'Anthropic', model: 'Claude Sonnet 4.6', releaseStatus: 'GA', category: 'Versatile', rates: { input: 3.0, cachedInput: 0.3, output: 15.0, cacheWrite: 3.75 } },
    { id: 'claude-opus-4.5', provider: 'Anthropic', model: 'Claude Opus 4.5', releaseStatus: 'GA', category: 'Powerful', rates: { input: 5.0, cachedInput: 0.5, output: 25.0, cacheWrite: 6.25 } },
    { id: 'claude-opus-4.6', provider: 'Anthropic', model: 'Claude Opus 4.6', releaseStatus: 'GA', category: 'Powerful', rates: { input: 5.0, cachedInput: 0.5, output: 25.0, cacheWrite: 6.25 } },
    { id: 'claude-opus-4.7', provider: 'Anthropic', model: 'Claude Opus 4.7', releaseStatus: 'GA', category: 'Powerful', rates: { input: 5.0, cachedInput: 0.5, output: 25.0, cacheWrite: 6.25 } },
    { id: 'gemini-2.5-pro', provider: 'Google', model: 'Gemini 2.5 Pro', releaseStatus: 'GA', category: 'Powerful', rates: { input: 1.25, cachedInput: 0.125, output: 10.0, cacheWrite: 0 }, notes: 'Prompts ≤200K tokens' },
    { id: 'gemini-3-flash', provider: 'Google', model: 'Gemini 3 Flash', releaseStatus: 'Public preview', category: 'Lightweight', rates: { input: 0.5, cachedInput: 0.05, output: 3.0, cacheWrite: 0 }, notes: 'No long-context surcharge' },
    { id: 'gemini-3.1-pro', provider: 'Google', model: 'Gemini 3.1 Pro', releaseStatus: 'Public preview', category: 'Powerful', rates: { input: 2.0, cachedInput: 0.2, output: 12.0, cacheWrite: 0 }, notes: 'Prompts ≤200K tokens' },
    { id: 'grok-code-fast-1', provider: 'xAI', model: 'Grok Code Fast 1', releaseStatus: 'GA', category: 'Lightweight', rates: { input: 0.2, cachedInput: 0.02, output: 1.5, cacheWrite: 0 } },
    { id: 'raptor-mini', provider: 'GitHub', model: 'Raptor mini', releaseStatus: 'Public preview', category: 'Versatile', rates: { input: 0.25, cachedInput: 0.025, output: 2.0, cacheWrite: 0 } },
    { id: 'goldeneye', provider: 'GitHub', model: 'Goldeneye', releaseStatus: 'Public preview', category: 'Powerful', rates: { input: 1.25, cachedInput: 0.125, output: 10.0, cacheWrite: 0 } }
  ]);

  function assertNonNegativeNumber(value, name) {
    if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value) || value < 0) {
      throw new Error(`${name} must be a non-negative finite number.`);
    }
  }

  function validateTokenUsage(tokenUsage) {
    if (!tokenUsage || typeof tokenUsage !== 'object') {
      throw new Error('tokenUsage must be an object.');
    }

    const normalized = {
      inputTokens: Number(tokenUsage.inputTokens),
      cachedInputTokens: Number(tokenUsage.cachedInputTokens ?? 0),
      outputTokens: Number(tokenUsage.outputTokens ?? 0),
      cacheWriteTokens: Number(tokenUsage.cacheWriteTokens ?? 0)
    };

    assertNonNegativeNumber(normalized.inputTokens, 'inputTokens');
    assertNonNegativeNumber(normalized.cachedInputTokens, 'cachedInputTokens');
    assertNonNegativeNumber(normalized.outputTokens, 'outputTokens');
    assertNonNegativeNumber(normalized.cacheWriteTokens, 'cacheWriteTokens');

    return normalized;
  }

  function calculateModelUsage(modelPricing, tokenUsage) {
    if (!modelPricing || !modelPricing.rates) {
      throw new Error('modelPricing must include rates.');
    }

    const tokens = validateTokenUsage(tokenUsage);
    const rates = modelPricing.rates;

    const estimatedCostUsd =
      (tokens.inputTokens / TOKENS_PER_MILLION) * rates.input +
      (tokens.cachedInputTokens / TOKENS_PER_MILLION) * rates.cachedInput +
      (tokens.outputTokens / TOKENS_PER_MILLION) * rates.output +
      (tokens.cacheWriteTokens / TOKENS_PER_MILLION) * (rates.cacheWrite || 0);

    const estimatedAiCredits = estimatedCostUsd / AI_CREDIT_USD;

    return {
      id: modelPricing.id,
      provider: modelPricing.provider,
      model: modelPricing.model,
      releaseStatus: modelPricing.releaseStatus,
      category: modelPricing.category,
      notes: modelPricing.notes || '',
      rates: rates,
      estimatedCostUsd: estimatedCostUsd,
      estimatedAiCredits: estimatedAiCredits
    };
  }

  function calculateAllModels(tokenUsage) {
    return MODEL_PRICING.map((modelPricing) => calculateModelUsage(modelPricing, tokenUsage))
      .sort((a, b) => b.estimatedCostUsd - a.estimatedCostUsd);
  }

  const exported = {
    TOKENS_PER_MILLION,
    AI_CREDIT_USD,
    MODEL_PRICING,
    validateTokenUsage,
    calculateModelUsage,
    calculateAllModels
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = exported;
  }

  if (globalScope) {
    globalScope.CopilotCalculatorCore = exported;
  }
})(typeof window !== 'undefined' ? window : globalThis);
