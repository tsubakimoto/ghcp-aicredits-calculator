# GitHub Copilot AI Credits Calculator

GitHub Copilot の usage-based billing（2026-06-01 以降）を前提に、トークン消費量からモデル別の概算コスト（USD）と AI Credits を算出する静的 Web アプリです。

## Pages

- 日本語: `index.html`
- English: `en/index.html`

## 使い方

1. `Input / Cached input / Output / Cache write` の各トークン数を入力
2. 「計算する / Calculate」を押す（入力中もリアルタイム更新）
3. モデル別の料金（USD）と AI Credits を確認

## 計算ルール

- 価格単位: **1M tokens あたり USD**
- `estimatedCostUsd = input/1,000,000 * inputRate + cached/1,000,000 * cachedRate + output/1,000,000 * outputRate + cacheWrite/1,000,000 * cacheWriteRate`
- `estimatedAiCredits = estimatedCostUsd / 0.01`（1 AI Credit = $0.01）

価格テーブルは以下を基に `assets/calculator-core.js` に集約しています。  
https://docs.github.com/en/copilot/reference/copilot-billing/models-and-pricing

## テスト

```bash
npm test
```

## GitHub Pages デプロイ

`.github/workflows/deploy.yml` で以下を実行します。

1. テスト実行（`npm test`）
2. 成功時に Pages へデプロイ

## English Version

For the English version of this README, please refer to [en/README.md](en/README.md).
