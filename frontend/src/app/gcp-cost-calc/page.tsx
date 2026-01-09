// src/app/gcp-cost/page.tsx
import React from "react";

export default function GcpCostPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-900/50 rounded-lg p-6 transition-colors duration-200">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          GCP 簡易コスト計算機
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Cloud Run と Cloud SQL を利用した場合の月額概算を計算します。
        </p>

        {/* ここに計算フォーム等のコンポーネントを追加する */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            ※ このツールは概算用です。正確な料金は公式Calculatorを参照してください。
          </p>
        </div>
      </div>
    </div>
  );
}
