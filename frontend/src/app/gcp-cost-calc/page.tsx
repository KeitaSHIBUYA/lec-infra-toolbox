// src/app/gcp-cost/page.tsx
"use client";

import { useMemo, useState } from "react";

// --- 定数定義 (東京リージョン: asia-northeast1 近似値) ---
// ※ 為替レートや単価は変動するため、メンテナンスしやすいよう定数化
const USD_JPY = 150; // 1ドル150円換算

const PRICING = {
  cloudRun: {
    cpu: 0.000024, // USD per vCPU-second
    memory: 0.0000025, // USD per GB-second
    request: 0.4, // USD per million requests
    freeTier: {
      cpuSeconds: 180000,
      memorySeconds: 360000, // GB-seconds
      requests: 2000000,
    },
  },
  cloudSql: {
    // Enterprise edition, Single zone pricing approx
    micro: 0.013, // db-f1-micro (USD/hour)
    small: 0.026, // db-g1-small (USD/hour)
    medium: 0.052, // db-n1-standard-1 (approx)
    storage: 0.17, // USD per GB/month
  },
};

export default function GcpCostPage() {
  // --- State管理 (入力値) ---
  const [cpu, setCpu] = useState(1);
  const [memory, setMemory] = useState(0.5); // GB
  const [requests, setRequests] = useState(1000000); // 月間リクエスト数
  const [duration, setDuration] = useState(200); // ミリ秒/リクエスト

  const [useSql, setUseSql] = useState(false);
  const [sqlType, setSqlType] = useState("micro");
  const [sqlStorage, setSqlStorage] = useState(10); // GB

  // --- 計算ロジック (派生データ) ---
  const cost = useMemo(() => {
    // 1. Cloud Run Calculation
    // 総処理時間 (秒) = リクエスト数 * (実行時間ms / 1000)
    const totalSeconds = requests * (duration / 1000);

    // vCPU秒とメモリGB秒
    const vCpuSeconds = totalSeconds * cpu;
    const memoryGbSeconds = totalSeconds * memory;

    // 無料枠の適用 (マイナスにならないようにMath.max)
    const billableCpu = Math.max(
      0,
      vCpuSeconds - PRICING.cloudRun.freeTier.cpuSeconds,
    );
    const billableMem = Math.max(
      0,
      memoryGbSeconds - PRICING.cloudRun.freeTier.memorySeconds,
    );
    const billableReq = Math.max(
      0,
      requests - PRICING.cloudRun.freeTier.requests,
    );

    // ドル建て計算
    const runCostUsd =
      billableCpu * PRICING.cloudRun.cpu +
      billableMem * PRICING.cloudRun.memory +
      (billableReq / 1000000) * PRICING.cloudRun.request;

    // 2. Cloud SQL Calculation
    let sqlCostUsd = 0;
    if (useSql) {
      const hoursPerMonth = 730; // 平均月間時間
      let hourlyRate = 0;
      switch (sqlType) {
        case "micro":
          hourlyRate = PRICING.cloudSql.micro;
          break;
        case "small":
          hourlyRate = PRICING.cloudSql.small;
          break;
        case "medium":
          hourlyRate = PRICING.cloudSql.medium;
          break;
      }
      sqlCostUsd =
        hourlyRate * hoursPerMonth + sqlStorage * PRICING.cloudSql.storage;
    }

    // 日本円換算
    return {
      run: Math.round(runCostUsd * USD_JPY),
      sql: Math.round(sqlCostUsd * USD_JPY),
      total: Math.round((runCostUsd + sqlCostUsd) * USD_JPY),
      currency: "JPY",
    };
  }, [cpu, memory, requests, duration, useSql, sqlType, sqlStorage]);

  // --- UIコンポーネント ---
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Google Cloud 簡易コストシミュレーター
          </h1>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
            Cloud Run + Cloud SQL 構成の月額費用を、
            <br />
            東京リージョンのレートで瞬時に試算します。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左側：入力フォーム (2カラム分) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cloud Run 設定 */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 p-2 rounded-md mr-3">
                  🚀
                </span>
                Cloud Run 設定
              </h2>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    vCPU
                  </label>
                  <select
                    value={cpu}
                    onChange={(e) => setCpu(Number(e.target.value))}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border"
                  >
                    <option value={1}>1 vCPU</option>
                    <option value={2}>2 vCPU</option>
                    <option value={4}>4 vCPU</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    メモリ
                  </label>
                  <select
                    value={memory}
                    onChange={(e) => setMemory(Number(e.target.value))}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border"
                  >
                    <option value={0.5}>512 MB</option>
                    <option value={1}>1 GB</option>
                    <option value={2}>2 GB</option>
                    <option value={4}>4 GB</option>
                  </select>
                </div>

                <div className="sm:col-span-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    月間リクエスト数
                    <span className="ml-2 text-gray-400 text-xs">
                      （{requests.toLocaleString()} req/mo）
                    </span>
                  </label>
                  <input
                    type="range"
                    min="10000"
                    max="10000000"
                    step="10000"
                    value={requests}
                    onChange={(e) => setRequests(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>1万</span>
                    <span>500万</span>
                    <span>1,000万</span>
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    平均処理時間 (ms)
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="200"
                    />
                    <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-300 sm:text-sm">
                      ms
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cloud SQL 設定 */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                  <span className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 p-2 rounded-md mr-3">
                    🗄️
                  </span>
                  Cloud SQL 設定
                </h2>
                <div className="flex items-center">
                  <input
                    id="use-sql"
                    type="checkbox"
                    checked={useSql}
                    onChange={(e) => setUseSql(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded"
                  />
                  <label
                    htmlFor="use-sql"
                    className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
                  >
                    利用する
                  </label>
                </div>
              </div>

              {useSql && (
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 animate-fade-in">
                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      インスタンスタイプ
                    </label>
                    <select
                      value={sqlType}
                      onChange={(e) => setSqlType(e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border"
                    >
                      <option value="micro">db-f1-micro (共有vCPU)</option>
                      <option value="small">db-g1-small (共有vCPU)</option>
                      <option value="medium">db-n1-standard-1 (1vCPU)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      ストレージ容量 (GB)
                    </label>
                    <input
                      type="number"
                      value={sqlStorage}
                      onChange={(e) => setSqlStorage(Number(e.target.value))}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 右側：計算結果 (1カラム分・Sticky) */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden sticky top-24 border border-gray-200 dark:border-gray-700">
              <div className="p-6 bg-white dark:bg-gray-800">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  月額見積もり (概算)
                </h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                    ¥{cost.total.toLocaleString()}
                  </span>
                  <span className="ml-1 text-xl font-medium text-gray-500 dark:text-gray-400">
                    /mo
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  1ドル = {USD_JPY}円 換算
                </p>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-6">
                <ul className="space-y-4">
                  <li className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      Cloud Run
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      ¥{cost.run.toLocaleString()}
                    </span>
                  </li>
                  {cost.run === 0 && requests > 0 && (
                    <li className="text-xs text-green-600 dark:text-green-400 text-right">
                      (無料枠内です 🎉)
                    </li>
                  )}
                  <li className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      Cloud SQL
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      ¥{cost.sql.toLocaleString()}
                    </span>
                  </li>
                </ul>

                <div className="mt-6">
                  <a
                    href="https://console.cloud.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white text-center hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    GCPコンソールへ
                  </a>
                </div>
                <p className="mt-4 text-xs text-gray-400 text-center">
                  ※ これは概算です。ネットワーク転送量等は含みません。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cloud Run の料金体系とコスト最適化のポイント */}

      <div className="mt-16 border-t border-gray-200 dark:border-gray-700 pt-10">
        <div className="prose prose-lg text-gray-500 dark:text-gray-400 mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Cloud Run の料金体系とコスト最適化のポイント
          </h2>
          <p>
            Cloud Run
            はサーバーレスなコンテナ実行環境ですが、その料金体系は「vCPU」「メモリ」「リクエスト数」の組み合わせで決まります。
            <br />
            ポイントは、<strong>アイドル時の課金がない</strong>
            という点と、<strong>無料枠の存在</strong>です。
          </p>

          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-6 mb-3">
            無料枠を最大限活用するには
          </h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Cloud Run には月間 180,000 vCPU 秒の無料枠があります。</li>
            <li>
              小規模な個人開発アプリや、社内ツールであれば、この無料枠内に収めることで実質
              0 円運用が可能です。
            </li>
            <li>
              当シミュレーターでは、この無料枠を自動的に控除して計算しています。
            </li>
          </ul>

          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-6 mb-3">
            Cloud SQL のコストに注意
          </h3>
          <p>
            Cloud Run が安く済んでも、RDB（Cloud
            SQL）は起動しているだけで時間課金が発生します。 開発環境では{" "}
            <code className="dark:bg-gray-700 dark:text-gray-200">
              db-f1-micro
            </code>{" "}
            を利用したり、夜間はインスタンスを停止するなどの工夫でコストを削減できます。
          </p>
        </div>
      </div>
    </div>
  );
}
