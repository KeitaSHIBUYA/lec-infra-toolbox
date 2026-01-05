// src/app/gcp-cost/page.tsx
import React from "react";

export default function GcpCostPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          GCP 簡易コスト計算機
        </h1>
        <p className="text-gray-600 mb-6">
          Cloud Run と Cloud SQL を利用した場合の月額概算を計算します。
        </p>

        {/* ここに計算フォーム等のコンポーネントを追加する */}
        <div className="border-t pt-4">
          <p className="text-sm text-gray-500">
            ※ このツールは概算用です。正確な料金は公式Calculatorを参照してください。
          </p>
        </div>
      </div>
    </div>
  );
}
