# SRE Toolbox

[![Deploy to Firebase Hosting](https://github.com/KeitaSHIBUYA/lec-infra-toolbox/actions/workflows/deploy-firebase.yaml/badge.svg)](https://github.com/KeitaSHIBUYA/lec-infra-toolbox/actions/workflows/deploy-firebase.yaml)

SRE・インフラエンジニアの「面倒くさい」を解消する、シンプルで高速なツール集です。

🔗 **サイトURL**: [https://lec-infra.com](https://lec-infra.com)

## 🛠️ 提供ツール

| ツール | 説明 | ステータス |
| ------ | ---- | ---------- |
| 💰 GCP 簡易コスト計算機 | Cloud Run, Cloud SQL などの概算コストを日本円ですばやく計算 | Beta |
| 🌐 CIDR / サブネット計算機 | IP アドレス範囲からネットマスク、ホスト数、IP レンジを可視化 | Beta |
| ⏰ Cron 式ジェネレーター | 複雑な Cron スケジュール式を生成・解説・テスト | Coming Soon |

## 🚀 技術スタック

- **フレームワーク**: [Next.js](https://nextjs.org/) 16 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS 4
- **ホスティング**: Firebase Hosting
- **CI/CD**: GitHub Actions (Workload Identity Federation)

## 💻 ローカル開発

### 必要要件

- Node.js 20 以上
- npm

### セットアップ

```bash
# リポジトリをクローン
git clone https://github.com/KeitaSHIBUYA/lec-infra-toolbox.git
cd lec-infra-toolbox/frontend

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

ブラウザで <http://localhost:3000> を開いてください。

### 利用可能なスクリプト

| コマンド | 説明 |
| -------- | ---- |
| `npm run dev` | 開発サーバーを起動 |
| `npm run build` | プロダクションビルドを作成 |
| `npm run start` | プロダクションサーバーを起動 |
| `npm run lint` | ESLint でコードをチェック |
| `npm run format` | Prettier でコードをフォーマット |

## 📁 プロジェクト構成

```text
lec-infra-toolbox/
├── .github/
│   └── workflows/
│       └── deploy-firebase.yaml    # Firebase デプロイ用ワークフロー
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── cidr-calc/          # CIDR 計算機
│   │   │   ├── gcp-cost-calc/      # GCP コスト計算機
│   │   │   ├── contact/            # お問い合わせページ
│   │   │   ├── privacy/            # プライバシーポリシー
│   │   │   ├── layout.tsx          # ルートレイアウト
│   │   │   └── page.tsx            # トップページ
│   │   └── components/
│   │       ├── Footer.tsx
│   │       ├── Header.tsx
│   │       └── ThemeProvider.tsx   # ダークモード対応
│   ├── public/                     # 静的アセット
│   ├── firebase.json               # Firebase 設定
│   └── package.json
└── README.md
```

## 🚢 デプロイ

`feature/*` ブランチへの push をトリガーに、GitHub Actions で自動デプロイされます。

デプロイには以下の Secrets が必要です:

- `WIF_PROVIDER`: Workload Identity Federation プロバイダー
- `WIF_SERVICE_ACCOUNT`: サービスアカウント ID
- `GCP_PROJECT_ID`: Google Cloud プロジェクト ID

## 👤 Author

**Keita SHIBUYA** - SRE Engineer

- Portfolio: [https://portfolio.lec-infra.com](https://portfolio.lec-infra.com)
- GitHub: [@KeitaSHIBUYA](https://github.com/KeitaSHIBUYA)
