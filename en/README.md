# GitHub Copilot AI Credits Calculator

This is a static web app designed to calculate approximate costs (USD) and AI Credits based on token consumption for GitHub Copilot's usage-based billing (effective from 2026-06-01).

## Pages

- Japanese: `index.html`
- English: `en/index.html`

## How to Use

1. Enter the token counts for `Input / Cached input / Output / Cache write`
2. Press "Calculate" (updates in real-time while typing)
3. Check the costs (USD) and AI Credits for each model

## Calculation Rules

- Price unit: **USD per 1M tokens**
- `estimatedCostUsd = input/1,000,000 * inputRate + cached/1,000,000 * cachedRate + output/1,000,000 * outputRate + cacheWrite/1,000,000 * cacheWriteRate`
- `estimatedAiCredits = estimatedCostUsd / 0.01` (1 AI Credit = $0.01)

The price table is consolidated in `assets/calculator-core.js` based on the following:  
https://docs.github.com/en/copilot/reference/copilot-billing/models-and-pricing

## Testing

```bash
npm test
```

## GitHub Pages Deployment

The `.github/workflows/deploy.yml` workflow performs the following:

1. Runs tests (`npm test`)
2. Deploys to Pages upon success