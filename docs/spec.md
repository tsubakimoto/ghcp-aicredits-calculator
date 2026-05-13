# 実装内容

## 概要

GitHub Copilotでは2026年6月1日から、トークン消費量ベースの料金体系が導入されます。

- 個人向け
  - https://docs.github.com/en/copilot/concepts/billing/usage-based-billing-for-individuals
- 組織向け
  - https://docs.github.com/en/copilot/concepts/billing/usage-based-billing-for-organizations-and-enterprises

価格設定の仕組みや価格表はこのページに記載されています。  
https://docs.github.com/en/copilot/reference/copilot-billing/models-and-pricing

実装上の `MODEL_PRICING` は、上記ページの表に掲載されているモデルのみを対象にします（OpenAI / Anthropic / Google / xAI / Fine-tuned (GitHub)）。
表にないモデル名や、表にないモデルを参照する注記は含めません。

## 機能

以下の含んだ機能を実装します。

- シンプルなUIのWebアプリケーションです
- ユーザーは消費するトークン数を入力し、フォームを送信します
- 消費するトークン数に基づいて、モデルごとの AI Credits および料金を計算します
- 計算結果をユーザーに表示します
- 日本語のページと、英語のページを用意します

## 技術スタック

- HTML, CSS, JavaScriptを使用してフロントエンドを構築します
- バックエンドは不要です
- GitHub Pagesにデプロイして公開します
