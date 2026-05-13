'use strict';

(function initApp() {
  const core = window.CopilotCalculatorCore;
  if (!core) {
    return;
  }

  const form = document.getElementById('calculator-form');
  const inputTokens = document.getElementById('input-tokens');
  const cachedInputTokens = document.getElementById('cached-input-tokens');
  const outputTokens = document.getElementById('output-tokens');
  const cacheWriteTokens = document.getElementById('cache-write-tokens');
  const resultsBody = document.getElementById('results-body');
  const errorMessage = document.getElementById('error-message');
  const languageSwitch = document.getElementById('language-switch');
  const isJa = document.documentElement.lang === 'ja';

  function formatCurrency(value) {
    return new Intl.NumberFormat(isJa ? 'ja-JP' : 'en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 4,
      maximumFractionDigits: 4
    }).format(value);
  }

  function formatNumber(value) {
    return new Intl.NumberFormat(isJa ? 'ja-JP' : 'en-US', {
      maximumFractionDigits: 4
    }).format(value);
  }

  function readTokens() {
    return {
      inputTokens: Number(inputTokens.value),
      cachedInputTokens: Number(cachedInputTokens.value || 0),
      outputTokens: Number(outputTokens.value || 0),
      cacheWriteTokens: Number(cacheWriteTokens.value || 0)
    };
  }

  function renderResults(results) {
    resultsBody.innerHTML = '';

    for (const result of results) {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${result.provider}</td>
        <td>${result.model}</td>
        <td>${formatCurrency(result.rates.input)}</td>
        <td>${formatCurrency(result.rates.cachedInput)}</td>
        <td>${formatCurrency(result.rates.output)}</td>
        <td>${formatCurrency(result.rates.cacheWrite || 0)}</td>
        <td>${formatCurrency(result.estimatedCostUsd)}</td>
        <td>${formatNumber(result.estimatedAiCredits)}</td>
      `;
      resultsBody.appendChild(row);
    }
  }

  function calculateAndRender(options = {}) {
    const { allowEmptyFields = false } = options;

    try {
      if (!allowEmptyFields && [inputTokens, cachedInputTokens, outputTokens, cacheWriteTokens].some((input) => input.value === '')) {
        errorMessage.textContent = '';
        return;
      }

      errorMessage.textContent = '';
      const usage = core.validateTokenUsage(readTokens());
      const results = core.calculateAllModels(usage);
      renderResults(results);
    } catch (error) {
      resultsBody.innerHTML = '';
      errorMessage.textContent = isJa
        ? '入力値が不正です。0 以上の数値を入力してください。'
        : 'Invalid input. Enter non-negative numbers.';
    }
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    calculateAndRender({ allowEmptyFields: true });
  });

  for (const input of [inputTokens, cachedInputTokens, outputTokens, cacheWriteTokens]) {
    input.addEventListener('input', calculateAndRender);
  }

  if (languageSwitch) {
    languageSwitch.addEventListener('click', () => {
      const target = languageSwitch.getAttribute('data-target');
      if (target) {
        window.location.href = target;
      }
    });
  }

  calculateAndRender();
})();
